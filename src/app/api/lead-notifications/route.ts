import { NextResponse } from "next/server";
import { LeadNotificationPayload } from "@/lib/lead-notifications";
import { sendTelegramLeadNotification } from "@/lib/telegram";

function isLeadNotificationPayload(value: unknown): value is LeadNotificationPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    (payload.type === "Quick Lead" || payload.type === "Instant Estimation") &&
    typeof payload.mode === "string" &&
    typeof payload.service === "string" &&
    typeof payload.phone === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isLeadNotificationPayload(body)) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const result = await sendTelegramLeadNotification(body);
    return NextResponse.json({ ok: true, skipped: result.skipped ?? false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
