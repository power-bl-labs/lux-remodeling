import { getDemoLeads, saveDemoLead } from "@/lib/demo-store";

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

export type StoredLead = LeadNotificationPayload & {
  id: string;
  createdAt: string;
};

export async function submitLead(payload: LeadNotificationPayload) {
  try {
    const response = await fetch("/api/lead-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Lead persistence failed");
    }
  } catch {
    saveDemoLead(payload);
  } finally {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("lux-demo-leads-updated"));
    }
  }
}

export async function fetchStoredLeads() {
  try {
    const response = await fetch("/api/lead-notifications", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Lead fetch failed");
    }

    const data = (await response.json()) as { leads?: StoredLead[] };
    return Array.isArray(data.leads) ? data.leads : [];
  } catch {
    return getDemoLeads();
  }
}
