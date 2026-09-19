import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("hashes a password and verifies the correct password against it", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    const isValid = await verifyPassword("correct-horse-battery-staple", hash);
    expect(isValid).toBe(true);
  });

  it("rejects a wrong password against a valid hash", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    const isValid = await verifyPassword("wrong-password", hash);
    expect(isValid).toBe(false);
  });

  it("produces a different hash each time (bcrypt salt), but both verify correctly", async () => {
    const hash1 = await hashPassword("stessa-password");
    const hash2 = await hashPassword("stessa-password");
    expect(hash1).not.toBe(hash2);
    expect(await verifyPassword("stessa-password", hash1)).toBe(true);
    expect(await verifyPassword("stessa-password", hash2)).toBe(true);
  });
});
