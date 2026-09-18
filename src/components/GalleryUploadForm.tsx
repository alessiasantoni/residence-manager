"use client";

import { useActionState } from "react";
import { addGalleryImages } from "@/app/actions/gallery";

export function GalleryUploadForm() {
  const [state, action, pending] = useActionState(addGalleryImages, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-neutral-700">
          Aggiungi foto (puoi selezionarne più di una)
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          required
          className="mt-1 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {pending ? "Caricamento…" : "Carica"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
