import Link from "next/link";
import type { Category } from "@prisma/client";

export function CategoryCard({ category }: { category: Category }) {
  const href = category.slug === "assistenza" ? "/assistenza" : `/${category.slug}`;

  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-cream-soft p-5 transition hover:border-ink/25"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-xl">
        {category.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-semibold text-ink">{category.name}</span>
        {category.description && (
          <span className="mt-0.5 block text-sm text-ink/60">{category.description}</span>
        )}
        <span className="mt-2 inline-block text-sm font-medium text-ink-light">Apri →</span>
      </span>
    </Link>
  );
}
