"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const AssistanceSchema = z.object({
  name: z.string().trim().min(1, { error: "Inserisci il tuo nome." }),
  email: z.email({ error: "Inserisci un'email valida." }),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, { error: "Scrivi il tuo messaggio." }),
});

export type AssistanceState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function createAssistanceRequest(
  _prevState: AssistanceState,
  formData: FormData
): Promise<AssistanceState> {
  const phoneRaw = formData.get("phone");
  const phone = typeof phoneRaw === "string" && phoneRaw.trim().length > 0 ? phoneRaw.trim() : undefined;

  const validatedFields = AssistanceSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone,
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Compila correttamente il modulo." };
  }

  await prisma.assistanceRequest.create({ data: validatedFields.data });

  return { success: true };
}

export async function markAssistanceHandled(id: string, handled: boolean) {
  await verifySession();
  await prisma.assistanceRequest.update({
    where: { id },
    data: { status: handled ? "HANDLED" : "NEW" },
  });
  revalidatePath("/admin/assistenza");
}
