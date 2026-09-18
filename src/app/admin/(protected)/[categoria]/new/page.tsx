import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createItem } from "@/app/actions/items";
import { ItemForm } from "@/components/ItemForm";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  const category = await prisma.category.findUnique({ where: { slug: categoria } });
  if (!category || category.slug === "assistenza") {
    notFound();
  }

  const action = createItem.bind(null, category.slug);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">
        Nuovo elemento — {category.icon} {category.name}
      </h1>
      <ItemForm action={action} />
    </div>
  );
}
