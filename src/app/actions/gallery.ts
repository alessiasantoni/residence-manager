"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { saveUploadedImage } from "@/lib/upload";

export type GalleryFormState =
  | {
      error?: string;
    }
  | undefined;

export async function addGalleryImages(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await verifySession();

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { error: "Scegli almeno una foto." };
  }

  const last = await prisma.galleryImage.findFirst({ orderBy: { order: "desc" } });
  let nextOrder = (last?.order ?? -1) + 1;

  for (const file of files) {
    try {
      const url = await saveUploadedImage(file);
      if (!url) continue;
      await prisma.galleryImage.create({ data: { url, order: nextOrder } });
      nextOrder += 1;
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento di una foto." };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/galleria");
  return undefined;
}

export async function deleteGalleryImage(id: string) {
  await verifySession();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/galleria");
}
