import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "appartamenti",
    name: "Appartamento",
    description: "Check-in, Wi-Fi, elettrodomestici, raccolta differenziata",
    icon: "🏠",
    order: 1,
  },
  {
    slug: "spiagge",
    name: "Spiagge",
    description: "Le spiagge più belle della Riviera del Conero",
    icon: "🏖️",
    imageFit: "cover",
    order: 2,
  },
  {
    slug: "ristoranti",
    name: "Ristoranti",
    description: "Dove mangiare bene in zona",
    icon: "🍽️",
    order: 3,
  },
  {
    slug: "cantine-e-vini",
    name: "Cantine e Vini",
    description: "Le cantine e i vini del territorio",
    icon: "🍷",
    order: 4,
  },
  {
    slug: "sentieri",
    name: "Sentieri",
    description: "Passeggiate e sentieri nel parco del Conero",
    icon: "🥾",
    order: 5,
  },
  {
    slug: "escursioni",
    name: "Gite in barca",
    description: "Gite ed escursioni da non perdere",
    icon: "⛵",
    order: 6,
  },
  {
    slug: "servizi-e-supermercati",
    name: "Servizi e Supermercati",
    description: "Supermercati, farmacie e servizi utili",
    icon: "🛒",
    order: 7,
  },
  {
    slug: "numeri-utili",
    name: "Numeri Utili",
    description: "Contatti utili per ogni evenienza",
    icon: "☎️",
    order: 8,
  },
  {
    slug: "mappe",
    name: "Mappe",
    description: "Le mappe della zona",
    icon: "🗺️",
    order: 9,
  },
  {
    slug: "assistenza",
    name: "Assistenza",
    description: "Scrivici per qualsiasi necessità",
    icon: "💬",
    order: 10,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: category,
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      siteName: "Residence Balconi del Conero",
      siteTagline: "Guida Ospiti",
      heroLocation: "Marcelli di Numana — Riviera del Conero",
      heroTitle: "Benvenuti al Residence Balconi del Conero",
      heroSubtitle:
        "Nove appartamenti a due passi dal mare, e una guida per vivere la Riviera del Conero come chi ci abita: spiagge, tavole, vino, sentieri e tutto il resto.",
      websiteUrl: "https://www.balconidelconero.com",
      contactAddress: "Via Amalfi 20/B, Marcelli di Numana (AN)",
      contactPhone: "+39 328 189 0857",
      footerNote: "9 appartamenti a due passi dal mare",
    },
    update: {
      siteName: "Residence Balconi del Conero",
      siteTagline: "Guida Ospiti",
      heroLocation: "Marcelli di Numana — Riviera del Conero",
      heroTitle: "Benvenuti al Residence Balconi del Conero",
      heroSubtitle:
        "Nove appartamenti a due passi dal mare, e una guida per vivere la Riviera del Conero come chi ci abita: spiagge, tavole, vino, sentieri e tutto il resto.",
      websiteUrl: "https://www.balconidelconero.com",
      contactAddress: "Via Amalfi 20/B, Marcelli di Numana (AN)",
      contactPhone: "+39 328 189 0857",
      footerNote: "9 appartamenti a due passi dal mare",
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD devono essere impostate in .env prima di eseguire il seed.");
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash },
    update: {},
  });

  console.log("Seed completato.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
