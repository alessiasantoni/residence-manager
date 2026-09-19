import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "@/lib/session";

// Nota: testiamo solo encrypt/decrypt (la logica JWT pura). createSession/getSession
// usano cookies() di Next.js, che richiede un request context reale e non ha senso
// testare fuori da un test end-to-end.

describe("session encrypt/decrypt", () => {
  it("cifra e poi decifra correttamente lo stesso payload", async () => {
    const token = await encrypt({ adminId: "admin_123", email: "admin@example.com" });
    const payload = await decrypt(token);

    expect(payload).not.toBeNull();
    expect(payload?.adminId).toBe("admin_123");
    expect(payload?.email).toBe("admin@example.com");
  });

  it("restituisce null per un token manomesso", async () => {
    const token = await encrypt({ adminId: "admin_123", email: "admin@example.com" });
    const tampered = token.slice(0, -2) + "xx"; // altera la firma

    const payload = await decrypt(tampered);
    expect(payload).toBeNull();
  });

  it("restituisce null per un token assente o vuoto", async () => {
    expect(await decrypt(undefined)).toBeNull();
    expect(await decrypt("")).toBeNull();
    expect(await decrypt("non-e-un-jwt")).toBeNull();
  });
});
