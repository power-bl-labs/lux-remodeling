import { prisma } from "@/lib/prisma";
import type { LeadNotificationPayload, StoredLead } from "@/lib/lead-notifications";

function splitName(name?: string) {
  const trimmed = name?.trim();

  if (!trimmed) {
    return {
      firstName: null,
      lastName: null,
    };
  }

  const parts = trimmed.split(/\s+/);

  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

function fallbackLeadType(projectSummary: string | null, explicitName?: string | null) {
  if (projectSummary?.includes("\"type\":\"Instant Estimation\"") || explicitName) {
    return "Instant Estimation" as const;
  }

  return "Quick Lead" as const;
}

export async function createStoredLead(payload: LeadNotificationPayload): Promise<StoredLead> {
  const { firstName, lastName } = splitName(payload.name);
  const metadata = {
    type: payload.type,
    mode: payload.mode,
    service: payload.service,
    phone: payload.phone,
    name: payload.name ?? null,
    sourceSite: payload.sourceSite ?? null,
    sourceLabel: payload.sourceLabel ?? null,
    pageUrl: payload.pageUrl ?? null,
    zipCode: payload.zipCode ?? null,
    timeline: payload.timeline ?? null,
    squareFootage: payload.squareFootage ?? null,
    propertyType: payload.propertyType ?? null,
    estimate: payload.estimate ?? null,
  };

  const lead = await prisma.lead.create({
    data: {
      firstName:
        firstName ??
        (payload.type === "Quick Lead" ? "Quick" : "Instant"),
      lastName:
        lastName ??
        (payload.type === "Quick Lead" ? "Lead" : "Estimation"),
      phone: payload.phone,
      zipCode: payload.zipCode ?? null,
      projectType: payload.service,
      projectSummary: JSON.stringify(metadata),
      budget:
        typeof payload.estimate === "number" ? String(payload.estimate) : null,
      activities: {
        create: {
          type: "LEAD_CAPTURED",
          description: `${payload.type} received via ${payload.mode}${
            payload.sourceLabel ? ` from ${payload.sourceLabel}` : ""
          }`,
        },
      },
    },
  });

  return {
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
    ...metadata,
    name: metadata.name ?? undefined,
    sourceSite: metadata.sourceSite ?? undefined,
    sourceLabel: metadata.sourceLabel ?? undefined,
    pageUrl: metadata.pageUrl ?? undefined,
    zipCode: metadata.zipCode ?? undefined,
    timeline: metadata.timeline ?? undefined,
    squareFootage: metadata.squareFootage ?? undefined,
    propertyType: metadata.propertyType ?? undefined,
    estimate: metadata.estimate ?? undefined,
  };
}

export async function listStoredLeads(): Promise<StoredLead[]> {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return leads.map((lead) => {
    let metadata: Partial<StoredLead> = {};

    try {
      metadata = lead.projectSummary
        ? (JSON.parse(lead.projectSummary) as Partial<StoredLead>)
        : {};
    } catch {
      metadata = {};
    }

    const fallbackName = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();
    const fallbackEstimate = lead.budget ? Number(lead.budget) : undefined;

    return {
      id: lead.id,
      type: metadata.type ?? fallbackLeadType(lead.projectSummary, fallbackName),
      mode: metadata.mode ?? "Remodel",
      service: metadata.service ?? lead.projectType ?? "Unknown Service",
      phone: metadata.phone ?? lead.phone ?? "",
      name: metadata.name ?? fallbackName ?? undefined,
      sourceSite: metadata.sourceSite ?? undefined,
      sourceLabel: metadata.sourceLabel ?? undefined,
      pageUrl: metadata.pageUrl ?? undefined,
      zipCode: metadata.zipCode ?? lead.zipCode ?? undefined,
      timeline: metadata.timeline ?? undefined,
      squareFootage: metadata.squareFootage ?? undefined,
      propertyType: metadata.propertyType ?? undefined,
      estimate:
        typeof metadata.estimate === "number"
          ? metadata.estimate
          : fallbackEstimate,
      createdAt: lead.createdAt.toISOString(),
    };
  });
}
