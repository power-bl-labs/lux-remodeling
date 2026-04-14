export type LeadNotificationPayload = {
  type: "Quick Lead" | "Instant Estimation";
  mode: string;
  service: string;
  phone: string;
  name?: string;
  zipCode?: string;
  timeline?: string;
  squareFootage?: number;
  propertyType?: string;
  estimate?: number;
};

export async function notifyLead(payload: LeadNotificationPayload) {
  try {
    await fetch("/api/lead-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Keep lead capture resilient even if Telegram is not configured yet.
  }
}
