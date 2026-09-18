"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const CategorySchema = z.object({
  name: z.string().trim().min(1, { error: "Il nome è obbligatorio." }),
  description: z.string().trim().optional(),
  icon: z.string().trim().min(1, { error: "Scegli un'emoji per l'icona." }),
  imageFit: z.enum(["cover", "contain"]),
});

export type CategoryFormState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function updateCategory(
  categorySlug: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await verifySession();

  const descriptionRaw = formData.get("description");
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim().length > 0 ? descriptionRaw.trim() : undefined;

  const validatedFields = CategorySchema.safeParse({
    name: formData.get("name"),
    description,
    icon: formData.get("icon"),
    imageFit: formData.get("imageFit"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Dati non validi." };
  }

  await prisma.category.update({
    where: { slug: categorySlug },
    data: validatedFields.data,
  });

  revalidatePath("/");
  revalidatePath(`/${categorySlug}`);
  revalidatePath(`/admin/${categorySlug}`);
  return { success: true };
}
