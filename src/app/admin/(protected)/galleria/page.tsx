import { prisma } from "@/lib/prisma";
import { deleteGalleryImage } from "@/app/actions/gallery";
import { GalleryUploadForm } from "@/components/GalleryUploadForm";
import { DeleteItemButton } from "@/components/DeleteItemButton";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">🖼️ Galleria</h1>
        <p className="text-sm text-neutral-500">
          Le foto qui sotto compaiono nella galleria scorrevole sotto l&apos;intestazione della homepage.
        </p>
      </div>

      <GalleryUploadForm />

      {images.length === 0 ? (
        <p className="text-neutral-500">Nessuna foto caricata.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => {
            const action = deleteGalleryImage.bind(null, image.id);
            return (
              <div key={image.id} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-32 w-full object-cover" />
                <div className="flex justify-center p-1">
                  <DeleteItemButton action={action} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
