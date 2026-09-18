import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "@/components/SiteSettingsForm";

export default async function AdminSitePage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Impostazioni sito</h1>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
