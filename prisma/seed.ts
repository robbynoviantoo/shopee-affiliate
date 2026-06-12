import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Mini Humidifier Pastel",
    description: "Humidifier compact untuk meja kerja dan kamar kecil.",
    price: "Rp59.000",
    category: "Rumah",
    imageUrl: "https://images.unsplash.com/photo-1632923057155-85ccca11f4b3?auto=format&fit=crop&w=900&q=80",
    affiliateUrl: "https://shopee.co.id/",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "Desk Lamp LED Minimalis",
    description: "Lampu belajar dengan tone hangat dan desain clean.",
    price: "Rp89.000",
    category: "Elektronik",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    affiliateUrl: "https://shopee.co.id/",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "Organizer Kabel Magnetik",
    description: "Bikin setup kerja lebih rapi tanpa kabel berantakan.",
    price: "Rp25.000",
    category: "Aksesoris",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80",
    affiliateUrl: "https://shopee.co.id/",
    sortOrder: 3,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replaceAll(" ", "-") },
      update: product,
      create: { id: product.name.toLowerCase().replaceAll(" ", "-"), ...product },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
