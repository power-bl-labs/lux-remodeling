import { LeadNotificationPayload } from "@/lib/lead-notifications";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildTelegramMessage(payload: LeadNotificationPayload) {
  const lines = [
    `<b>${escapeHtml(payload.type)}</b>`,
    `<b>Service:</b> ${escapeHtml(payload.service)}`,
    `<b>Phone:</b> ${escapeHtml(payload.phone)}`,
  ];

  if (payload.mode) {
    lines.push(`<b>Mode:</b> ${escapeHtml(payload.mode)}`);
  }

  if (payload.name) {
    lines.push(`<b>Name:</b> ${escapeHtml(payload.name)}`);
  }

  if (payload.zipCode) {
    lines.push(`<b>ZIP:</b> ${escapeHtml(payload.zipCode)}`);
  }

  if (payload.timeline) {
    lines.push(`<b>Timeline:</b> ${escapeHtml(payload.timeline)}`);
  }

  if (payload.squareFootage) {
    lines.push(`<b>Square Footage:</b> ${escapeHtml(String(payload.squareFootage))} sq ft`);
  }

  if (payload.propertyType) {
    lines.push(`<b>Property:</b> ${escapeHtml(payload.propertyType)}`);
  }

  if (typeof payload.estimate === "number") {
    lines.push(`<b>Starting Range:</b> ${escapeHtml(formatCurrency(payload.estimate))}`);
  }

  return lines.join("\n");
}

export async function sendTelegramLeadNotification(payload: LeadNotificationPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, skipped: true as const };
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const message = buildTelegramMessage(payload);
  const isPublicHttpUrl =
    /^https?:\/\//.test(baseUrl) &&
    !baseUrl.includes("localhost") &&
    !baseUrl.includes("127.0.0.1");

  const inlineKeyboard = isPublicHttpUrl
    ? [
        [
          {
            text: "Open Admin",
            url: `${baseUrl}/admin-demo`,
          },
        ],
      ]
    : undefined;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(inlineKeyboard
        ? {
            reply_markup: {
              inline_keyboard: inlineKeyboard,
            },
          }
        : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram notification failed: ${errorText}`);
  }

  return { ok: true as const, skipped: false as const };
}
