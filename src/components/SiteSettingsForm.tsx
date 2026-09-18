"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";
import { updateSiteSettings } from "@/app/actions/site";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      )}
    </div>
  );
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action, pending] = useActionState(updateSiteSettings, undefined);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <p className="text-sm font-semibold text-neutral-500">Identità</p>
      <Field label="Nome della struttura" name="siteName" defaultValue={settings?.siteName} />
      <Field label={'Tagline (sotto il nome, es. "Guida Ospiti")'} name="siteTagline" defaultValue={settings?.siteTagline} />

      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-neutral-700">
          Logo
        </label>
        {settings?.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logoUrl} alt="" className="mt-2 h-16 w-16 rounded-full object-cover" />
        )}
        <input id="logo" name="logo" type="file" accept="image/*" className="mt-1 w-full text-sm" />
      </div>

      <hr className="border-black/10" />
      <p className="text-sm font-semibold text-neutral-500">Sezione di benvenuto</p>
      <Field label={'Località (es. "Marcelli di Numana — Riviera del Conero")'} name="heroLocation" defaultValue={settings?.heroLocation} />
      <Field label="Titolo di benvenuto" name="heroTitle" defaultValue={settings?.heroTitle} />
      <Field label="Sottotitolo" name="heroSubtitle" defaultValue={settings?.heroSubtitle} textarea />

      <div>
        <label htmlFor="heroImage" className="block text-sm font-medium text-neutral-700">
          Foto di copertina
        </label>
        {settings?.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.heroImageUrl} alt="" className="mt-2 h-24 w-40 rounded object-cover" />
        )}
        <input id="heroImage" name="heroImage" type="file" accept="image/*" className="mt-1 w-full text-sm" />
      </div>

      <hr className="border-black/10" />
      <p className="text-sm font-semibold text-neutral-500">Contatti</p>
      <Field label="Telefono" name="contactPhone" defaultValue={settings?.contactPhone} />
      <Field label="Email" name="contactEmail" defaultValue={settings?.contactEmail} type="email" />
      <Field label="Indirizzo" name="contactAddress" defaultValue={settings?.contactAddress} />
      <Field label="Sito web" name="websiteUrl" defaultValue={settings?.websiteUrl} />
      <Field label="Link mappa (Google Maps)" name="mapUrl" defaultValue={settings?.mapUrl} />

      <hr className="border-black/10" />
      <p className="text-sm font-semibold text-neutral-500">Social</p>
      <Field label="Instagram (link)" name="instagramUrl" defaultValue={settings?.instagramUrl} />
      <Field label="Facebook (link)" name="facebookUrl" defaultValue={settings?.facebookUrl} />
      <Field label="WhatsApp (numero)" name="whatsappNumber" defaultValue={settings?.whatsappNumber} />

      <Field label="Nota a piè di pagina" name="footerNote" defaultValue={settings?.footerNote} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700">Impostazioni salvate.</p>}

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
