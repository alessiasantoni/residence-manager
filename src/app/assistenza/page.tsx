import { getSiteChrome } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { AssistanceForm } from "@/components/AssistanceForm";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function AssistenzaPage() {
  const { settings, categories } = await getSiteChrome();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-8">
        <h1 className="mb-2 flex items-center gap-2 font-display text-2xl font-bold text-ink">
          <span>💬</span>
          Assistenza
        </h1>
        <p className="mb-6 text-ink/60">
          Hai bisogno di aiuto? Scrivici e ti risponderemo il prima possibile.
        </p>

        <AssistanceForm />
      </main>

      <Footer settings={settings} categories={categories} />
    </div>
  );
}
