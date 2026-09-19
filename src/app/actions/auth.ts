"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

const LoginSchema = z.object({
  email: z.email({ error: "Inserisci un'email valida." }),
  password: z.string().min(1, { error: "Inserisci la password." }),
});

export type LoginState =
  | {
      error?: string;
    }
  | undefined;

// Hash bcrypt "finto", non corrisponde a nessuna password reale: serve solo
// a far impiegare a bcrypt lo stesso tempo anche quando l'utente non esiste,
// così il tempo di risposta non rivela se un'email è registrata come admin.
const DUMMY_HASH = "$2b$10$OiOEgoefqPc/87Xlca3gOOSvmglYp6E8FDdFMX7rlIEsZ3V/O7vee";

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: "Email o password non validi." };
  }

  const { email, password } = validatedFields.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Confronto SEMPRE eseguito, con l'hash vero se l'utente esiste, altrimenti con quello finto.
  const passwordValid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !passwordValid) {
    return { error: "Credenziali non corrette." };
  }

  await createSession({ adminId: admin.id, email: admin.email });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
