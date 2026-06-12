import { ProductExplorer } from "@/components/product-explorer";

export const dynamic = "force-dynamic";

type PublicProduct = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
};

const fallbackProducts: PublicProduct[] = [
  {
    id: "demo-1",
    name: "Mini Humidifier Pastel",
    description: "Humidifier compact untuk meja kerja dan kamar kecil.",
    price: "Rp59.000",
    category: "Rumah",
    imageUrl: "https://images.unsplash.com/photo-1632923057155-85ccca11f4b3?auto=format&fit=crop&w=900&q=80",
    affiliateUrl: "https://shopee.co.id/",
    isFeatured: true,
  },
  {
    id: "demo-2",
    name: "Desk Lamp LED Minimalis",
    description: "Lampu belajar warm light untuk setup kerja.",
    price: "Rp89.000",
    category: "Elektronik",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    affiliateUrl: "https://shopee.co.id/",
    isFeatured: true,
  },
];

export default async function Home() {
  let products: PublicProduct[] = fallbackProducts;

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
    const { prisma } = await import("@/lib/prisma");
    products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        imageUrl: true,
        affiliateUrl: true,
        isFeatured: true,
      },
    });
  } catch {
    products = fallbackProducts;
  }

  return (
    <main className="min-h-screen bg-cream px-3 py-4 text-black md:px-5">
      <section className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="neo-panel relative overflow-hidden bg-yellow px-5 py-4 md:px-6 md:py-5">
          <div className="absolute -right-7 -top-7 size-20 rounded-full border-3 border-black bg-pink" />
          <div className="absolute bottom-4 right-5 hidden rotate-6 rounded-lg border-3 border-black bg-sky px-3 py-1.5 text-sm font-black shadow-neo-sm md:block">
            Shopee Finds
          </div>
          <div className="relative max-w-xl space-y-2">
            <p className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase shadow-neo-sm">
              Produk affiliate pilihan
            </p>
            <h1 className="text-3xl font-black leading-none tracking-tight md:text-4xl lg:text-5xl">
              Link Shopee favorit yang gampang dicari.
            </h1>
            <p className="max-w-lg text-sm font-bold md:text-base">
              Cari produk berdasarkan nama, kategori, atau status unggulan.
            </p>
          </div>
        </header>

        <ProductExplorer products={products} />
      </section>
    </main>
  );
}

