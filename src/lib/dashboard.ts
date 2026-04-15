import { LeadStatus } from "@prisma/client";
import { hasUsableDatabaseUrl } from "@/lib/database-config";
import { prisma } from "@/lib/prisma";

type DashboardData = {
  totalLeads: number;
  newLeads: number;
  activeLeads: number;
  wonLeads: number;
  connected: boolean;
};

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasUsableDatabaseUrl()) {
    return {
      totalLeads: 0,
      newLeads: 0,
      activeLeads: 0,
      wonLeads: 0,
      connected: false,
    };
  }

  try {
    const [totalLeads, newLeads, activeLeads, wonLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          status: LeadStatus.NEW,
        },
      }),
      prisma.lead.count({
        where: {
          status: {
            in: [LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.ESTIMATING],
          },
        },
      }),
      prisma.lead.count({
        where: {
          status: LeadStatus.WON,
        },
      }),
    ]);

    return {
      totalLeads,
      newLeads,
      activeLeads,
      wonLeads,
      connected: true,
    };
  } catch (error) {
    console.error("Dashboard metrics are not available yet:", error);

    return {
      totalLeads: 0,
      newLeads: 0,
      activeLeads: 0,
      wonLeads: 0,
      connected: false,
    };
  }
}
