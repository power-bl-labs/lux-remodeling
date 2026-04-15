import { getDemoLeads, saveDemoLead } from "@/lib/demo-store";

export type LeadNotificationPayload = {
  type: "Quick Lead" | "Instant Estimation";
  mode: string;
  service: string;
  phone: string;
  name?: string;
  sourceSite?: string;
  sourceLabel?: string;
  pageUrl?: string;
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

function canUseBrowserFallback() {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  );
}

export async function submitLead(payload: LeadNotificationPayload) {
  let shouldDispatch = false;

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

    shouldDispatch = true;
    return await response.json();
  } catch (error) {
    if (canUseBrowserFallback()) {
      saveDemoLead(payload);
      shouldDispatch = true;
      return { ok: true, fallback: true as const };
    }

    throw error;
  } finally {
    if (shouldDispatch && typeof window !== "undefined") {
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
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(data?.error ?? "Lead fetch failed");
    }

    const data = (await response.json()) as { leads?: StoredLead[] };
    return Array.isArray(data.leads) ? data.leads : [];
  } catch (error) {
    if (canUseBrowserFallback()) {
      return getDemoLeads();
    }

    throw error;
  }
}
