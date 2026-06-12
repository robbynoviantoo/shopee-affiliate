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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Berlianna's - Shopee Affiliate Finds",
    url: siteUrl,
    description: "Katalog rekomendasi produk Shopee affiliate pilihan Berlianna's dengan filter kategori dan hot deals.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="neo-panel relative mb-5 overflow-hidden bg-yellow px-5 py-4 md:px-6 md:py-5">
          <div className="absolute -right-7 -top-7 size-20 rounded-full border-3 border-black bg-pink" />
          <div className="absolute bottom-4 right-5 hidden rotate-6 rounded-lg border-3 border-black bg-sky px-3 py-1.5 text-sm font-black shadow-neo-sm md:block">
            Berlianna&apos;s Picks
          </div>
          <div className="relative max-w-3xl space-y-2">
            <div className="space-y-2">
              <p className="mb-5 inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase shadow-neo-sm">
                Berlianna&apos;s affiliate picks
              </p>
              <h1 className="mb-5 text-3xl font-black leading-none tracking-tight md:text-4xl lg:text-5xl">
                Berlianna&apos;s - Shopee Affiliate Finds
              </h1>
              <p className="max-w-2xl text-sm font-bold md:text-base">
                Katalog rekomendasi produk Shopee affiliate pilihan, lengkap dengan kategori, pencarian cepat, dan hot deals.
              </p>
            </div>
          </div>
        </header>
        <ProductExplorer products={products} />
      </section>
    </main>
  );
}






