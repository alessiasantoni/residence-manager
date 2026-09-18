import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categories, newRequestsCount] = await Promise.all([
    prisma.category.findMany({
      where: { slug: { not: "assistenza" } },
      orderBy: { order: "asc" },
      include: { _count: { select: { items: true } } },
    }),
    prisma.assistanceRequest.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/admin/${category.slug}`}
            className="rounded-lg border border-black/10 bg-white p-4 shadow-sm hover:border-emerald-300"
          >
            <p className="text-sm text-neutral-500">
              {category.icon} {category.name}
            </p>
            <p className="text-2xl font-semibold text-neutral-900">{category._count.items}</p>
            <p className="text-xs text-neutral-400">elementi pubblicati</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/assistenza"
        className="block rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 hover:border-emerald-400"
      >
        {newRequestsCount > 0
          ? `${newRequestsCount} nuova/e richiesta/e di assistenza da gestire →`
          : "Nessuna nuova richiesta di assistenza"}
      </Link>
    </div>
  );
}
