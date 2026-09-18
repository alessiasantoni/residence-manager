import Link from "next/link";
import type { Category, SiteSettings } from "@prisma/client";
import { MobileNav } from "@/components/MobileNav";

export function SiteHeader({
  settings,
  categories,
}: {
  settings: SiteSettings | null;
  categories: Category[];
}) {
  const initials = (settings?.siteName ?? "H")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/15 bg-cream-soft">
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-sm font-semibold text-ink">{initials}</span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold leading-tight text-ink">
              {settings?.siteName ?? "La tua struttura"}
            </span>
            {settings?.siteTagline && (
              <span className="block text-[11px] font-medium uppercase tracking-widest text-ink/60">
                {settings.siteTagline}
              </span>
            )}
          </span>
        </Link>

        <MobileNav categories={categories} />
      </div>
    </header>
  );
}
