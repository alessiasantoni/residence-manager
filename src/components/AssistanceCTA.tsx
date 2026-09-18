import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

export function AssistanceCTA({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <div className="rounded-3xl bg-gradient-to-br from-ink-light to-ink p-6 text-cream-soft sm:p-8">
        <h2 className="font-display text-2xl font-semibold">Serve una mano?</h2>
        <p className="mt-2 text-cream-soft/85">
          Siamo raggiungibili tutti i giorni dalle 8:00 alle 21:00 per qualsiasi necessità in
          appartamento o consiglio sulla zona.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          {settings.contactPhone && (
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center justify-center gap-2 rounded-full bg-cream-soft px-5 py-3 text-sm font-semibold text-ink"
            >
              📞 Chiama il residence
            </a>
          )}
          {settings.websiteUrl && (
            <a
              href={settings.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-cream-soft/40 px-5 py-3 text-sm font-medium text-cream-soft"
            >
              🌐 {settings.websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          )}
          {settings.mapUrl && (
            <a
              href={settings.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-cream-soft/40 px-5 py-3 text-sm font-medium text-cream-soft"
            >
              📍 Mappa
            </a>
          )}
          {!settings.contactPhone && !settings.websiteUrl && !settings.mapUrl && (
            <Link
              href="/assistenza"
              className="flex items-center justify-center gap-2 rounded-full bg-cream-soft px-5 py-3 text-sm font-semibold text-ink"
            >
              💬 Scrivici
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
