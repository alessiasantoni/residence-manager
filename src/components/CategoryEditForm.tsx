"use client";

import { useActionState } from "react";
import type { Category } from "@prisma/client";
import { updateCategory } from "@/app/actions/categories";

export function CategoryEditForm({ category }: { category: Category }) {
  const action = updateCategory.bind(null, category.slug);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <details className="rounded-lg border border-black/10 bg-white p-4">
      <summary className="cursor-pointer text-sm font-medium text-neutral-600">
        Modifica nome, descrizione, icona e stile delle foto della sezione
      </summary>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="w-20">
          <label htmlFor="icon" className="block text-xs font-medium text-neutral-500">
            Icona
          </label>
          <input
            id="icon"
            name="icon"
            defaultValue={category.icon}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-center focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="name" className="block text-xs font-medium text-neutral-500">
            Nome
          </label>
          <input
            id="name"
            name="name"
            defaultValue={category.name}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex-[2]">
          <label htmlFor="description" className="block text-xs font-medium text-neutral-500">
            Descrizione breve
          </label>
          <input
            id="description"
            name="description"
            defaultValue={category.description ?? ""}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="w-56">
          <label htmlFor="imageFit" className="block text-xs font-medium text-neutral-500">
            Foto degli elementi
          </label>
          <select
            id="imageFit"
            name="imageFit"
            defaultValue={category.imageFit}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          >
            <option value="contain">Mostra tutta la foto (nessun taglio)</option>
            <option value="cover">Riempi il riquadro (ritaglia)</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {pending ? "Salvataggio…" : "Salva"}
        </button>
      </form>

      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-emerald-700">Sezione aggiornata.</p>}
    </details>
  );
}
