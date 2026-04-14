import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type DashboardData = {
  totalLeads: number;
  newLeads: number;
  activeLeads: number;
  wonLeads: number;
  connected: boolean;
};

export async function getDashboardData(): Promise<DashboardData> {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const isPlaceholderDatabaseUrl =
    !databaseUrl ||
    databaseUrl.includes("mysql://USER:PASSWORD@") ||
    databaseUrl.includes("@localhost:3306/lux_remodeling");

  if (isPlaceholderDatabaseUrl) {
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
