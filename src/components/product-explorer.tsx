"use client";

import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
};

export function ProductExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "Semua" || product.category === category;
      const matchesFeatured = !featuredOnly || product.isFeatured;
      return matchesQuery && matchesCategory && matchesFeatured;
    });
  }, [category, featuredOnly, products, query]);

  return (
    <section className="space-y-4">
      <div className="neo-panel bg-white p-2.5 md:p-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari produk..."
              className="neo-input w-full py-2.5 pl-9 pr-3 text-xs"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="neo-input min-w-28 px-2.5 py-2.5 text-xs"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setFeaturedOnly((value) => !value)}
              className={clsx("neo-button px-2.5 py-2 text-xs", featuredOnly ? "bg-lime" : "bg-white")}
            >
              <SlidersHorizontal className="size-3.5" /> Unggulan
            </button>
            <div className="flex overflow-hidden rounded-md border-2 border-black shadow-neo-sm">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                className={clsx("px-2.5 py-2", layout === "grid" ? "bg-orange" : "bg-white")}
                aria-label="Tampilan grid"
              >
                <Grid2X2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                className={clsx("border-l-2 border-black px-2.5 py-2", layout === "list" ? "bg-sky" : "bg-white")}
                aria-label="Tampilan list"
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="rounded-full border-2 border-black bg-black px-3 py-1 text-[11px] font-black text-white shadow-neo-sm">
          {filteredProducts.length} produk
        </p>
        <a href="/admin" className="text-xs font-black underline decoration-2 underline-offset-4">
          Admin
        </a>
      </div>

      <div className={clsx(layout === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "space-y-3")}>
        {filteredProducts.map((product) => (
          <article key={product.id} className={clsx("neo-card bg-white", layout === "list" && "md:flex md:gap-3")}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={clsx(
                "h-32 w-full border-b-2 border-black object-cover sm:h-36",
                layout === "list" && "md:h-28 md:w-36 md:border-b-0 md:border-r-2",
              )}
            />
            <div className="flex flex-1 flex-col gap-2.5 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="rounded-full border-2 border-black bg-pink px-2 py-0.5 text-[9px] font-black uppercase shadow-neo-sm">
                  {product.category}
                </span>
                {product.isFeatured ? <span className="text-xs">?</span> : null}
              </div>
              <div>
                <h3 className="text-sm font-black leading-tight md:text-base">{product.name}</h3>
                {product.description ? <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-relaxed text-zinc-700">{product.description}</p> : null}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2">
                <p className="text-sm font-black text-orange-600">{product.price || "Cek harga"}</p>
                <a className="neo-button bg-black px-2.5 py-1.5 text-xs text-white" href={product.affiliateUrl} target="_blank" rel="noreferrer sponsored noopener">
                  Beli
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
