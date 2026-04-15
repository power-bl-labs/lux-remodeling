import { NextResponse } from "next/server";
import { z } from "zod";
import { createStoredLead } from "@/lib/server-leads";
import { sendTelegramLeadNotification } from "@/lib/telegram";
import type { LeadNotificationPayload } from "@/lib/lead-notifications";
import { isValidUsPhone } from "@/lib/us-phone";

const externalLeadSchema = z.object({
  service: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  sourceSite: z.string().trim().max(255).optional(),
  sourceLabel: z.string().trim().max(120).optional(),
  pageUrl: z.string().trim().max(1000).optional(),
  website: z.string().trim().max(255).optional(),
});

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function getSourceSite(input: {
  request: Request;
  sourceSite?: string;
  pageUrl?: string;
}) {
  const explicitSource = input.sourceSite?.trim();

  if (explicitSource) {
    return explicitSource;
  }

  const origin = input.request.headers.get("origin")?.trim();
  if (origin) {
    return origin;
  }

  const referer = input.request.headers.get("referer")?.trim();
  if (referer) {
    return referer;
  }

  const pageUrl = input.pageUrl?.trim();
  return pageUrl || "External Website";
}

function getSourceLabel(sourceSite: string, inputLabel?: string) {
  if (inputLabel?.trim()) {
    return inputLabel.trim();
  }

  try {
    const url = new URL(sourceSite);
    return url.hostname;
  } catch {
    return sourceSite;
  }
}

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const text = await request.text();
  return Object.fromEntries(new URLSearchParams(text).entries());
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"));

  try {
    const rawBody = await parseRequestBody(request);
    const parsed = externalLeadSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid external lead payload." },
        { status: 400, headers },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true, skipped: true }, { status: 200, headers });
    }

    if (!isValidUsPhone(parsed.data.phone)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid U.S. phone number." },
        { status: 400, headers },
      );
    }

    const sourceSite = getSourceSite({
      request,
      sourceSite: parsed.data.sourceSite,
      pageUrl: parsed.data.pageUrl,
    });

    const payload: LeadNotificationPayload = {
      type: "Quick Lead",
      mode: "External Embed",
      service: parsed.data.service,
      phone: parsed.data.phone,
      sourceSite,
      sourceLabel: getSourceLabel(sourceSite, parsed.data.sourceLabel),
      pageUrl: parsed.data.pageUrl?.trim() || undefined,
    };

    const lead = await createStoredLead(payload);
    let skipped = true;
    let notificationError: string | null = null;

    try {
      const result = await sendTelegramLeadNotification(payload);
      skipped = result.skipped ?? false;
    } catch (error) {
      notificationError =
        error instanceof Error ? error.message : "Telegram notification failed";
      console.error("Telegram notification failed after external lead persistence:", error);
    }

    return NextResponse.json(
      {
        ok: true,
        lead,
        skipped,
        notificationError,
      },
      { status: 200, headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500, headers });
  }
}
