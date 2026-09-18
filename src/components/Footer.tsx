import Link from "next/link";
import type { Category, SiteSettings } from "@prisma/client";

export function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings | null;
  categories: Category[];
}) {
  const guideLinks = categories.filter((c) => c.slug !== "assistenza");

  return (
    <footer className="border-t border-ink/10 bg-cream px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-ink">
          {settings?.siteName ?? "La tua struttura"}
        </h2>
        {settings?.contactAddress && <p className="mt-3 text-ink/60">{settings.contactAddress}</p>}
        {settings?.footerNote && <p className="text-ink/60">{settings.footerNote}</p>}

        {(settings?.contactPhone || settings?.websiteUrl) && (
          <div className="mt-4 flex flex-col gap-1">
            {settings.contactPhone && (
              <a href={`tel:${settings.contactPhone}`} className="font-medium text-ink-light">
                {settings.contactPhone}
              </a>
            )}
            {settings.websiteUrl && (
              <a
                href={settings.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-light"
              >
                {settings.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        )}

        {guideLinks.length > 0 && (
          <div className="mt-8 border-t border-ink/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">La guida</p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {guideLinks.map((category) => (
                <Link key={category.id} href={`/${category.slug}`} className="text-ink/80 hover:text-ink">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
