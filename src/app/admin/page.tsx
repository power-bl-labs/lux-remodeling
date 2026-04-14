import { getDashboardData } from "@/lib/dashboard";

const cards = [
  {
    key: "totalLeads",
    label: "Total leads",
  },
  {
    key: "newLeads",
    label: "New leads",
  },
  {
    key: "activeLeads",
    label: "Active pipeline",
  },
  {
    key: "wonLeads",
    label: "Won jobs",
  },
] as const;

const nextSteps = [
  "Connect real MySQL credentials from Hostinger or local MySQL.",
  "Run Prisma schema sync and seed the first admin user.",
  "Build lead capture forms on the marketing pages.",
  "Add lead table, filters, notes, and status transitions.",
];

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <main className="space-y-10">
      <section className="flex flex-col gap-4 rounded-[2rem] bg-stone-950 px-8 py-8 text-stone-100 shadow-[0_30px_80px_rgba(43,31,24,0.16)]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-stone-400">
          Dashboard foundation
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">
          Protected admin shell is live.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-stone-300">
          This area is ready to become the internal CRM for inbound leads,
          callbacks, estimates, and client pipeline management.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-stone-950">
              {data[card.key]}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <article className="rounded-[1.75rem] border border-stone-200 bg-white p-7 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-stone-500">
            Setup status
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-stone-950">
            {data.connected ? "Database is connected." : "Database is not connected yet."}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            The admin shell already works, but the metrics will stay at zero until
            we point Prisma to a real MySQL database and seed the first records.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-stone-200 bg-[#f0e7dd] p-7 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-stone-500">
            Next build steps
          </p>
          <div className="mt-5 grid gap-3">
            {nextSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl bg-white px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-stone-700">{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
