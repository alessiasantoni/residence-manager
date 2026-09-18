"use client";

import { useActionState } from "react";
import type { Item } from "@prisma/client";
import type { ItemFormState } from "@/app/actions/items";

type ItemFormAction = (state: ItemFormState, formData: FormData) => Promise<ItemFormState>;

export function ItemForm({
  action,
  defaultValues,
}: {
  action: ItemFormAction;
  defaultValues?: Item;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
          Titolo
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
          Descrizione
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
          Indirizzo
        </label>
        <input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
          Telefono
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={defaultValues?.phone ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
          Link (sito web, mappa o altro)
        </label>
        <input
          id="website"
          name="website"
          defaultValue={defaultValues?.website ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="mapEmbedUrl" className="block text-sm font-medium text-neutral-700">
          Link mappa da incorporare (facoltativo)
        </label>
        <input
          id="mapEmbedUrl"
          name="mapEmbedUrl"
          placeholder="URL da Google Maps (Condividi → Incorpora mappa)"
          defaultValue={defaultValues?.mapEmbedUrl ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-neutral-700">
          Foto
        </label>
        {defaultValues?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={defaultValues.imageUrl} alt="" className="mt-2 h-32 w-32 rounded object-cover" />
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="mt-1 w-full text-sm"
        />
      </div>

      <div>
        <label htmlFor="pdf" className="block text-sm font-medium text-neutral-700">
          PDF (facoltativo, es. listino, mappa, menu)
        </label>
        {defaultValues?.pdfUrl && (
          <a
            href={defaultValues.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-emerald-700 hover:underline"
          >
            📄 PDF attuale
          </a>
        )}
        <input
          id="pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          className="mt-1 w-full text-sm"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {pending ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
