import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteItem, toggleItemPublished } from "@/app/actions/items";
import { DeleteItemButton } from "@/components/DeleteItemButton";
import { CategoryEditForm } from "@/components/CategoryEditForm";

export default async function AdminCategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categoria },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!category || category.slug === "assistenza") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">
          {category.icon} {category.name}
        </h1>
        <Link
          href={`/admin/${category.slug}/new`}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + Nuovo
        </Link>
      </div>

      <CategoryEditForm category={category} />

      {category.items.length === 0 ? (
        <p className="text-neutral-500">Nessun elemento. Aggiungine uno.</p>
      ) : (
        <div className="divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
          {category.items.map((item) => {
            const toggleAction = toggleItemPublished.bind(null, category.slug, item.id, !item.published);
            const deleteAction = deleteItem.bind(null, category.slug, item.id);

            return (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="text-xs text-neutral-400">{item.published ? "Pubblicato" : "Nascosto"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href={`/admin/${category.slug}/${item.id}`}
                    className="rounded px-3 py-1.5 text-emerald-700 hover:bg-emerald-50"
                  >
                    Modifica
                  </Link>
                  <form action={toggleAction}>
                    <button type="submit" className="rounded px-3 py-1.5 text-neutral-600 hover:bg-neutral-100">
                      {item.published ? "Nascondi" : "Pubblica"}
                    </button>
                  </form>
                  <DeleteItemButton action={deleteAction} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
