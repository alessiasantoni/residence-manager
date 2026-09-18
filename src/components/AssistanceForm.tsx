"use client";

import { useActionState } from "react";
import { createAssistanceRequest } from "@/app/actions/assistance";

export function AssistanceForm() {
  const [state, action, pending] = useActionState(createAssistanceRequest, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-accent bg-accent/30 p-4 text-ink">
        Grazie! Il tuo messaggio è stato inviato, ti risponderemo al più presto.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink/70">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-md border border-ink/20 bg-cream-soft px-3 py-2 focus:border-ink-light focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-ink/20 bg-cream-soft px-3 py-2 focus:border-ink-light focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink/70">
          Telefono (facoltativo)
        </label>
        <input
          id="phone"
          name="phone"
          className="mt-1 w-full rounded-md border border-ink/20 bg-cream-soft px-3 py-2 focus:border-ink-light focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink/70">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-ink/20 bg-cream-soft px-3 py-2 focus:border-ink-light focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream-soft hover:bg-ink-light disabled:opacity-50"
      >
        {pending ? "Invio in corso…" : "Invia richiesta"}
      </button>
    </form>
  );
}
