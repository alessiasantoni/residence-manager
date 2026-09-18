import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteChrome = cache(async () => {
  const [settings, categories] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { settings, categories };
});
