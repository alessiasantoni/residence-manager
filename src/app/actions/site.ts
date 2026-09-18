"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { saveUploadedImage } from "@/lib/upload";

const SiteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, { error: "Il nome della struttura è obbligatorio." }),
  siteTagline: z.string().trim().optional(),
  heroLocation: z.string().trim().optional(),
  heroTitle: z.string().trim().min(1, { error: "Il titolo è obbligatorio." }),
  heroSubtitle: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactAddress: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
  mapUrl: z.string().trim().optional(),
  instagramUrl: z.string().trim().optional(),
  facebookUrl: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  footerNote: z.string().trim().optional(),
});

export type SiteSettingsState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = typeof value === "string" ? value.trim() : "";
  return str.length > 0 ? str : undefined;
}

export async function updateSiteSettings(
  _prevState: SiteSettingsState,
  formData: FormData
): Promise<SiteSettingsState> {
  await verifySession();

  const validatedFields = SiteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    siteTagline: emptyToUndefined(formData.get("siteTagline")),
    heroLocation: emptyToUndefined(formData.get("heroLocation")),
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: emptyToUndefined(formData.get("heroSubtitle")),
    contactPhone: emptyToUndefined(formData.get("contactPhone")),
    contactEmail: emptyToUndefined(formData.get("contactEmail")),
    contactAddress: emptyToUndefined(formData.get("contactAddress")),
    websiteUrl: emptyToUndefined(formData.get("websiteUrl")),
    mapUrl: emptyToUndefined(formData.get("mapUrl")),
    instagramUrl: emptyToUndefined(formData.get("instagramUrl")),
    facebookUrl: emptyToUndefined(formData.get("facebookUrl")),
    whatsappNumber: emptyToUndefined(formData.get("whatsappNumber")),
    footerNote: emptyToUndefined(formData.get("footerNote")),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Dati non validi." };
  }

  const data: Record<string, unknown> = { ...validatedFields.data };

  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      data.logoUrl = await saveUploadedImage(logoFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento del logo." };
    }
  }

  const heroImageFile = formData.get("heroImage");
  if (heroImageFile instanceof File && heroImageFile.size > 0) {
    try {
      data.heroImageUrl = await saveUploadedImage(heroImageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Errore durante il caricamento della foto di copertina." };
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main", ...data } as never,
    update: data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/site");
  return { success: true };
}
