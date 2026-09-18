import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { logout } from "@/app/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  const categories = await prisma.category.findMany({
    where: { slug: { not: "assistenza" } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      <aside className="w-full shrink-0 border-b border-black/10 bg-white p-4 md:w-56 md:border-b-0 md:border-r">
        <p className="mb-4 font-semibold text-neutral-900">Admin</p>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded px-2 py-1.5 hover:bg-emerald-50">
            Dashboard
          </Link>
          <Link href="/admin/site" className="rounded px-2 py-1.5 hover:bg-emerald-50">
            Impostazioni sito
          </Link>
          <Link href="/admin/galleria" className="rounded px-2 py-1.5 hover:bg-emerald-50">
            🖼️ Galleria
          </Link>
          <p className="mt-3 px-2 text-xs font-semibold uppercase text-neutral-400">Sezioni</p>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/admin/${category.slug}`}
              className="rounded px-2 py-1.5 hover:bg-emerald-50"
            >
              {category.icon} {category.name}
            </Link>
          ))}
          <p className="mt-3 px-2 text-xs font-semibold uppercase text-neutral-400">Assistenza</p>
          <Link href="/admin/assistenza" className="rounded px-2 py-1.5 hover:bg-emerald-50">
            💬 Richieste
          </Link>

          <form action={logout} className="mt-4 border-t border-black/10 pt-3">
            <button type="submit" className="w-full rounded px-2 py-1.5 text-left text-red-600 hover:bg-red-50">
              Esci
            </button>
          </form>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
