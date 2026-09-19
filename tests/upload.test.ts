import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock del filesystem e di Vercel Blob: nei test non vogliamo scrivere file
// veri su disco né chiamare un servizio esterno.
vi.mock("fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
}));

import { saveUploadedImage, saveUploadedPdf } from "@/lib/upload";

beforeEach(() => {
  // Ci assicuriamo di testare il percorso "disco locale", non quello Vercel Blob.
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

describe("saveUploadedImage", () => {
  it("rifiuta un file con tipo MIME non supportato", async () => {
    const file = new File(["contenuto finto"], "documento.txt", { type: "text/plain" });

    await expect(saveUploadedImage(file)).rejects.toThrow(/formato immagine non supportato/i);
  });

  it("rifiuta un'immagine che supera 8MB", async () => {
    const bigBuffer = new Uint8Array(9 * 1024 * 1024); // 9MB > limite di 8MB
    const file = new File([bigBuffer], "foto-enorme.png", { type: "image/png" });

    await expect(saveUploadedImage(file)).rejects.toThrow(/8MB/);
  });

  it("accetta un'immagine valida e restituisce un percorso /uploads/...", async () => {
    const file = new File(["dati immagine finti"], "foto.png", { type: "image/png" });

    const url = await saveUploadedImage(file);

    expect(url).toMatch(/^\/uploads\/.+\.png$/);
  });
});

describe("saveUploadedPdf", () => {
  it("rifiuta un file che non è un PDF", async () => {
    const file = new File(["dati immagine finti"], "foto.png", { type: "image/png" });

    await expect(saveUploadedPdf(file)).rejects.toThrow(/carica un file pdf/i);
  });

  it("accetta un PDF valido e restituisce un percorso /uploads/...", async () => {
    const file = new File(["%PDF-1.4 finto contenuto"], "scheda.pdf", { type: "application/pdf" });

    const url = await saveUploadedPdf(file);

    expect(url).toMatch(/^\/uploads\/.+\.pdf$/);
  });
});
