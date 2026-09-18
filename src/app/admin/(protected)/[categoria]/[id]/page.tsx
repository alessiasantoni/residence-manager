import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateItem } from "@/app/actions/items";
import { ItemForm } from "@/components/ItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ categoria: string; id: string }>;
}) {
  const { categoria, id } = await params;

  const [category, item] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categoria } }),
    prisma.item.findUnique({ where: { id } }),
  ]);

  if (!category || category.slug === "assistenza" || !item || item.categoryId !== category.id) {
    notFound();
  }

  const action = updateItem.bind(null, category.slug, item.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">
        Modifica — {category.icon} {category.name}
      </h1>
      <ItemForm action={action} defaultValues={item} />
    </div>
  );
}
