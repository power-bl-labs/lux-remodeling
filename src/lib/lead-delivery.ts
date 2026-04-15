import type { LeadNotificationPayload, StoredLead } from "@/lib/lead-notifications";
import { sendTelegramLeadNotification } from "@/lib/telegram";

type LeadDeliveryResult = {
  telegramSkipped: boolean;
  telegramError: string | null;
  sheetSkipped: boolean;
  sheetError: string | null;
};

function getGoogleLeadsWebhookUrl() {
  return process.env.GOOGLE_LEADS_WEBHOOK_URL?.trim() || null;
}

function getGoogleLeadsWebhookSecret() {
  return process.env.GOOGLE_LEADS_WEBHOOK_SECRET?.trim() || null;
}

function getLeadCategory(payload: LeadNotificationPayload) {
  return payload.type.trim();
}

function getLeadSubcategory(payload: LeadNotificationPayload) {
  return payload.mode.trim();
}

function buildSheetTabName(payload: LeadNotificationPayload) {
  return payload.type === "Instant Estimation" ? "Instant Estimation" : "Quick Leads";
}

async function syncLeadToGoogleSheets(
  lead: StoredLead,
  payload: LeadNotificationPayload,
) {
  const webhookUrl = getGoogleLeadsWebhookUrl();

  if (!webhookUrl) {
    return { ok: false, skipped: true as const };
  }

  const webhookSecret = getGoogleLeadsWebhookSecret();
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret
        ? {
            "X-Lux-Webhook-Secret": webhookSecret,
          }
        : {}),
    },
    body: JSON.stringify({
      leadId: lead.id,
      receivedAt: lead.createdAt,
      status: "New",
      category: getLeadCategory(payload),
      subcategory: getLeadSubcategory(payload),
      sheetTab: buildSheetTabName(payload),
      type: payload.type,
      mode: payload.mode,
      service: payload.service,
      phone: payload.phone,
      name: payload.name ?? "",
      sourceLabel: payload.sourceLabel ?? "",
      sourceSite: payload.sourceSite ?? "",
      pageUrl: payload.pageUrl ?? "",
      zipCode: payload.zipCode ?? "",
      timeline: payload.timeline ?? "",
      squareFootage:
        typeof payload.squareFootage === "number" ? String(payload.squareFootage) : "",
      propertyType: payload.propertyType ?? "",
      estimate:
        typeof payload.estimate === "number" ? String(payload.estimate) : "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets sync failed: ${errorText}`);
  }

  return { ok: true as const, skipped: false as const };
}

export async function deliverLead(
  lead: StoredLead,
  payload: LeadNotificationPayload,
): Promise<LeadDeliveryResult> {
  let telegramSkipped = true;
  let telegramError: string | null = null;
  let sheetSkipped = true;
  let sheetError: string | null = null;

  try {
    const telegramResult = await sendTelegramLeadNotification(payload);
    telegramSkipped = telegramResult.skipped ?? false;
  } catch (error) {
    telegramError =
      error instanceof Error ? error.message : "Telegram notification failed";
    console.error("Telegram notification failed after lead persistence:", error);
  }

  try {
    const sheetResult = await syncLeadToGoogleSheets(lead, payload);
    sheetSkipped = sheetResult.skipped ?? false;
  } catch (error) {
    sheetError =
      error instanceof Error ? error.message : "Google Sheets sync failed";
    console.error("Google Sheets sync failed after lead persistence:", error);
  }

  return {
    telegramSkipped,
    telegramError,
    sheetSkipped,
    sheetError,
  };
}
