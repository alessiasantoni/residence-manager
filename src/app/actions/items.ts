"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { saveUploadedImage, saveUploadedPdf } from "@/lib/upload";

const ItemSchema = z.object({
  title: z.string().trim().min(1, { error: "Il titolo è obbligatorio." }),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  website: z.string().trim().optional(),
  mapEmbedUrl: z.string().trim().optional(),
});

export type ItemFormState =
  | {
      error?: string;
    }
  | undefined;

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = typeof value === "string" ? value.trim() : "";
  return str.length > 0 ? str : undefined;
}

export async function createItem(
  categorySlug: string,
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await verifySession();

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return { error: "Sezione non trovata." };
  }

  const validatedFields = ItemSchema.safeParse({
    title: formData.get("title"),
    description: emptyToUndefined(formData.get("description")),
    address: emptyToUndefined(formData.get("address")),
    phone: emptyToUndefined(formData.get("phone")),
    website: emptyToUndefined(formData.get("website")),
    mapEmbedUrl: emptyToUndefined(formData.get("mapEmbedUrl")),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Dati non validi." };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await saveUploadedImage(imageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento dell'immagine." };
    }
  }

  let pdfUrl: string | null = null;
  const pdfFile = formData.get("pdf");
  if (pdfFile instanceof File && pdfFile.size > 0) {
    try {
      pdfUrl = await saveUploadedPdf(pdfFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento del PDF." };
    }
  }

  await prisma.item.create({
    data: {
      categoryId: category.id,
      ...validatedFields.data,
      imageUrl,
      pdfUrl,
    },
  });

  revalidatePath(`/${categorySlug}`);
  revalidatePath(`/admin/${categorySlug}`);
  redirect(`/admin/${categorySlug}`);
}

export async function updateItem(
  categorySlug: string,
  itemId: string,
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await verifySession();

  const validatedFields = ItemSchema.safeParse({
    title: formData.get("title"),
    description: emptyToUndefined(formData.get("description")),
    address: emptyToUndefined(formData.get("address")),
    phone: emptyToUndefined(formData.get("phone")),
    website: emptyToUndefined(formData.get("website")),
    mapEmbedUrl: emptyToUndefined(formData.get("mapEmbedUrl")),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Dati non validi." };
  }

  const data: Record<string, unknown> = { ...validatedFields.data };

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      data.imageUrl = await saveUploadedImage(imageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento dell'immagine." };
    }
  }

  const pdfFile = formData.get("pdf");
  if (pdfFile instanceof File && pdfFile.size > 0) {
    try {
      data.pdfUrl = await saveUploadedPdf(pdfFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento del PDF." };
    }
  }

  await prisma.item.update({
    where: { id: itemId },
    data,
  });

  revalidatePath(`/${categorySlug}`);
  revalidatePath(`/admin/${categorySlug}`);
  redirect(`/admin/${categorySlug}`);
}

export async function deleteItem(categorySlug: string, itemId: string) {
  await verifySession();
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath(`/${categorySlug}`);
  revalidatePath(`/admin/${categorySlug}`);
}

export async function toggleItemPublished(categorySlug: string, itemId: string, published: boolean) {
  await verifySession();
  await prisma.item.update({ where: { id: itemId }, data: { published } });
  revalidatePath(`/${categorySlug}`);
  revalidatePath(`/admin/${categorySlug}`);
}
