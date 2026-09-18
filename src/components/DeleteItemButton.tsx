"use client";

import { useTransition } from "react";

export function DeleteItemButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="rounded px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Eliminazione…" : "Elimina"}
    </button>
  );
}
