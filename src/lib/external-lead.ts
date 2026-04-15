import { z } from "zod";
import { createStoredLead } from "@/lib/server-leads";
import { deliverLead } from "@/lib/lead-delivery";
import type { LeadNotificationPayload } from "@/lib/lead-notifications";
import { isValidUsPhone } from "@/lib/us-phone";

export const externalLeadSchema = z.object({
  service: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  sourceSite: z.string().trim().max(255).optional(),
  sourceLabel: z.string().trim().max(120).optional(),
  pageUrl: z.string().trim().max(1000).optional(),
  returnUrl: z.string().trim().max(1000).optional(),
  website: z.string().trim().max(255).optional(),
});

type ExternalLeadInput = z.infer<typeof externalLeadSchema>;

export function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function getSourceSite(input: {
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

export function getSourceLabel(sourceSite: string, inputLabel?: string) {
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

export async function parseExternalLeadRequestBody(request: Request) {
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

export async function handleExternalLeadSubmission(
  request: Request,
  rawBody: unknown,
) {
  const parsed = externalLeadSchema.safeParse(rawBody);

  if (!parsed.success) {
    return {
      ok: false as const,
      status: 400,
      error: "Invalid external lead payload.",
      input: null,
    };
  }

  if (parsed.data.website) {
    return {
      ok: true as const,
      status: 200,
      lead: null,
      skipped: true,
      notificationError: null,
      input: parsed.data,
    };
  }

  if (!isValidUsPhone(parsed.data.phone)) {
    return {
      ok: false as const,
      status: 400,
      error: "Enter a valid U.S. phone number.",
      input: parsed.data,
    };
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
  const delivery = await deliverLead(lead, payload);

  return {
    ok: true as const,
    status: 200,
    lead,
    telegramSkipped: delivery.telegramSkipped,
    telegramError: delivery.telegramError,
    sheetSkipped: delivery.sheetSkipped,
    sheetError: delivery.sheetError,
    input: parsed.data,
  };
}

export function buildExternalLeadReturnUrl(
  request: Request,
  input: ExternalLeadInput | null | undefined,
  result: {
    ok: boolean;
    error?: string;
  },
) {
  const requestedReturnUrl = input?.returnUrl?.trim();
  const fallbackPageUrl = input?.pageUrl?.trim();
  const fallbackReferer = request.headers.get("referer")?.trim();
  const destination =
    requestedReturnUrl || fallbackPageUrl || fallbackReferer || "/";

  const url = new URL(destination);
  url.searchParams.set("luxLeadStatus", result.ok ? "success" : "error");
  url.searchParams.set(
    "luxLeadMessage",
    result.ok
      ? "Thanks. We received your request and will contact you soon."
      : result.error || "Could not send your request.",
  );

  return url;
}
