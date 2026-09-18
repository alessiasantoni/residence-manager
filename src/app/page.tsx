import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteChrome } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Gallery } from "@/components/Gallery";
import { CategoryCard } from "@/components/CategoryCard";
import { AssistanceCTA } from "@/components/AssistanceCTA";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ settings, categories }, galleryImages] = await Promise.all([
    getSiteChrome(),
    prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
  ]);

  const ctaCategories = categories.filter((c) => c.slug !== "assistenza").slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} categories={categories} />

      <section className="relative isolate flex min-h-[85vh] flex-col justify-end overflow-hidden bg-ink px-4 pb-10 pt-24 text-cream-soft sm:min-h-[75vh]">
        {settings?.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.heroImageUrl}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />

        <div className="mx-auto w-full max-w-3xl">
          {settings?.heroLocation && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream-soft/80">
              {settings.heroLocation}
            </p>
          )}
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            {settings?.heroTitle ?? "Benvenuti"}
          </h1>
          {settings?.heroSubtitle && (
            <p className="mt-4 max-w-xl text-cream-soft/90 whitespace-pre-line">{settings.heroSubtitle}</p>
          )}

          {ctaCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {ctaCategories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className={
                    i === 0
                      ? "rounded-full bg-cream-soft px-5 py-3 text-sm font-semibold text-ink"
                      : "rounded-full border border-cream-soft/50 px-5 py-3 text-sm font-medium text-cream-soft"
                  }
                >
                  {category.name} {i === 0 && "→"}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="flex-1">
        <Gallery images={galleryImages} />

        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="font-display text-2xl font-bold text-ink">La guida</h2>
          <p className="mt-1 text-ink/60">Tutto quello che serve per il soggiorno.</p>

          <div className="mt-6 flex flex-col gap-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      </main>

      <AssistanceCTA settings={settings} />
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
