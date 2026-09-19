import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock delle dipendenze esterne alla funzione login: così testiamo SOLO la sua
// logica (validazione, controllo credenziali, creazione sessione) senza bisogno
// di un vero database Postgres o di un vero request/response Next.js.

vi.mock("@/lib/prisma", () => ({
  prisma: {
    adminUser: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/session", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("@/lib/password", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { redirect } from "next/navigation";
import { login } from "@/app/actions/auth";

function formDataWith(email: string, password: string) {
  const fd = new FormData();
  fd.set("email", email);
  fd.set("password", password);
  return fd;
}

describe("login()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rifiuta un'email non valida senza interrogare il database", async () => {
    const result = await login(undefined, formDataWith("non-una-email", "qualcosa"));

    expect(result?.error).toBeTruthy();
    expect(prisma.adminUser.findUnique).not.toHaveBeenCalled();
  });

  it("con utente inesistente, confronta comunque una password (niente timing leak) e rifiuta", async () => {
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = await login(undefined, formDataWith("nessuno@example.com", "qualsiasi"));

    expect(result?.error).toBe("Credenziali non corrette.");
    // Punto chiave del fix: verifyPassword deve essere chiamata comunque,
    // anche se l'utente non esiste, così il tempo di risposta non rivela
    // se quell'email è registrata come admin.
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("con utente esistente ma password sbagliata, rifiuta senza creare sessione", async () => {
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
      id: "admin_1",
      email: "admin@example.com",
      passwordHash: "hash-fittizio",
      name: null,
      createdAt: new Date(),
    });
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = await login(undefined, formDataWith("admin@example.com", "password-sbagliata"));

    expect(result?.error).toBe("Credenziali non corrette.");
    expect(createSession).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("con credenziali corrette, crea la sessione e reindirizza a /admin", async () => {
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
      id: "admin_1",
      email: "admin@example.com",
      passwordHash: "hash-vero",
      name: null,
      createdAt: new Date(),
    });
    vi.mocked(verifyPassword).mockResolvedValue(true);

    await login(undefined, formDataWith("admin@example.com", "password-corretta"));

    expect(createSession).toHaveBeenCalledWith({ adminId: "admin_1", email: "admin@example.com" });
    expect(redirect).toHaveBeenCalledWith("/admin");
  });
});
