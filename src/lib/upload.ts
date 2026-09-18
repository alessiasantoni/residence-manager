import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const PDF_TYPES = new Set(["application/pdf"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

async function saveUploadedFile(
  file: File,
  allowedTypes: Set<string>,
  errorMessage: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!allowedTypes.has(file.type)) {
    throw new Error(errorMessage);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Il file supera la dimensione massima di 8MB.");
  }

  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${randomUUID()}${extension}`;

  // In produzione (Vercel) il filesystem non è permanente: le foto vanno su Vercel Blob.
  // In locale, senza quel servizio collegato, restano salvate su disco come finora.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

export function saveUploadedImage(file: File) {
  return saveUploadedFile(file, IMAGE_TYPES, "Formato immagine non supportato. Usa JPG, PNG, WEBP o GIF.");
}

export function saveUploadedPdf(file: File) {
  return saveUploadedFile(file, PDF_TYPES, "Formato non supportato. Carica un file PDF.");
}
