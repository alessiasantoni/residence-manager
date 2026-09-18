import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteChrome } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { ItemCard } from "@/components/ItemCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  if (categoria === "assistenza") {
    redirect("/assistenza");
  }

  const [category, { settings, categories }] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: categoria },
      include: { items: { where: { published: true }, orderBy: { order: "asc" } } },
    }),
    getSiteChrome(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">
            {category.icon}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{category.name}</h1>
            {category.description && <p className="text-sm text-ink/60">{category.description}</p>}
          </div>
        </div>

        {category.items.length === 0 ? (
          <p className="text-ink/50">Nessun contenuto disponibile al momento.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {category.items.map((item) => (
              <ItemCard key={item.id} item={item} imageFit={category.imageFit} />
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} categories={categories} />
    </div>
  );
}
