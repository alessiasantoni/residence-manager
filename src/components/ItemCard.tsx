import type { Item } from "@prisma/client";
import { ItemImage } from "@/components/ItemImage";

export function ItemCard({ item, imageFit = "contain" }: { item: Item; imageFit?: string }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft">
      {item.imageUrl && <ItemImage src={item.imageUrl} alt={item.title} imageFit={imageFit} />}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
        {item.description && <p className="text-ink/70 whitespace-pre-line">{item.description}</p>}

        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-ink/60">
          {item.address && <span>📍 {item.address}</span>}
          {item.phone && (
            <a className="text-ink-light hover:underline" href={`tel:${item.phone}`}>
              📞 {item.phone}
            </a>
          )}
          {item.website && (
            <a className="text-ink-light hover:underline" href={item.website} target="_blank" rel="noopener noreferrer">
              🔗 Link
            </a>
          )}
          {item.pdfUrl && (
            <a className="text-ink-light hover:underline" href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
              📄 PDF
            </a>
          )}
        </div>

        {item.mapEmbedUrl && (
          <div className="pt-2">
            <iframe
              src={item.mapEmbedUrl}
              className="h-64 w-full rounded-lg border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </article>
  );
}
