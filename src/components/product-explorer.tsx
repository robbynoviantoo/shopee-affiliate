"use client";

import { ExternalLink, Grid2X2, List, Search, X } from "lucide-react";
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

function priceTeaser(price: string | null) {
  if (!price) return "Cek deal terbaru";
  return price.toLowerCase().includes("rp") ? `Mulai ${price}` : price;
}

function AnimatedFlame({ active }: { active: boolean }) {
  return (
    <span className={clsx("flame-wrap is-active", !active && "is-idle")} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="flame-svg" width="18" height="18">
        <path className="flame-outer" d="M32 59c-12.2 0-21-8.1-21-19.2 0-7.5 4.1-13.4 9-18.2 4.7-4.6 8.8-9.3 8.1-16.6-.1-1.5 1.6-2.4 2.8-1.5C40.7 10.8 53 22.5 53 39.3 53 50.1 44.3 59 32 59Z" />
        <path className="flame-mid" d="M33.1 55c-8.4 0-14.2-5.6-14.2-13.3 0-5.2 3-9.1 6.4-12.5 3.1-3 6.1-6.5 5.8-11.7-.1-1.1 1.1-1.8 2-.9 6.7 5.8 12.5 13.2 12.5 24.8C45.6 49 40.6 55 33.1 55Z" />
        <path className="flame-inner" d="M31.7 54c-4.8 0-8.3-3.4-8.3-8.2 0-3.3 2.1-5.8 4.2-8.1 2.2-2.4 4.4-5.1 4.2-8.8 0-.9 1-1.4 1.7-.8 4.5 4.1 7.4 9.5 7.4 16.1 0 5.6-3.7 9.8-9.2 9.8Z" />
      </svg>
    </span>
  );
}
function ModalSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.05fr]">
      <div className="h-64 animate-pulse rounded-xl border-2 border-black bg-zinc-200" />
      <div className="space-y-3">
        <div className="h-7 w-24 animate-pulse rounded-full border-2 border-black bg-pink" />
        <div className="h-10 w-4/5 animate-pulse rounded-lg bg-zinc-200" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-16 animate-pulse rounded-xl border-2 border-black bg-yellow" />
          <div className="h-16 animate-pulse rounded-xl border-2 border-black bg-sky" />
        </div>
      </div>
    </div>
  );
}

export function ProductExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filteredCategories = useMemo(() => {
    const normalizedCategoryQuery = categoryQuery.trim().toLowerCase();
    if (!normalizedCategoryQuery) return categories;
    return categories.filter((item) => item.toLowerCase().includes(normalizedCategoryQuery));
  }, [categories, categoryQuery]);
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

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setIsModalLoading(true);
    window.setTimeout(() => setIsModalLoading(false), 450);
  }

  function closeProduct() {
    setSelectedProduct(null);
    setIsModalLoading(false);
  }

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
            <div className="group relative min-w-36">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2" />
              <input
                value={categoryQuery}
                onChange={(event) => {
                  const nextCategoryQuery = event.target.value;
                  setCategoryQuery(nextCategoryQuery);
                  const exactCategory = categories.find((item) => item.toLowerCase() === nextCategoryQuery.trim().toLowerCase());
                  if (exactCategory) setCategory(exactCategory);
                }}
                onFocus={() => setCategoryQuery(category === "Semua" ? "" : category)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  const nextCategory = filteredCategories[0] ?? "Semua";
                  setCategory(nextCategory);
                  setCategoryQuery(nextCategory === "Semua" ? "" : nextCategory);
                }}
                placeholder={category}
                className="neo-input w-full py-2.5 pl-8 pr-2.5 text-xs"
                list="category-options"
              />
              <datalist id="category-options">
                {filteredCategories.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <div className="absolute left-0 top-[calc(100%+6px)] z-20 hidden max-h-44 w-full overflow-auto rounded-lg border-2 border-black bg-white p-1 shadow-neo-sm group-focus-within:block group-hover:block">
                {filteredCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setCategory(item);
                      setCategoryQuery(item === "Semua" ? "" : item);
                    }}
                    className={clsx("w-full rounded-md px-2 py-1.5 text-left text-xs font-black", category === item ? "bg-orange" : "hover:bg-yellow")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFeaturedOnly((value) => !value)}
              className={clsx("neo-button px-2.5 py-2 text-xs", featuredOnly ? "bg-lime" : "bg-white")}
            >
              <AnimatedFlame active={featuredOnly} /> Hot
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
      </div>

      <div className={clsx(layout === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "space-y-3")}>
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => openProduct(product)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") openProduct(product);
            }}
            role="button"
            tabIndex={0}
            className={clsx("neo-card cursor-pointer bg-white", layout === "list" && "md:flex md:min-h-32 md:gap-3")}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className={clsx(
                "h-32 w-full border-b-2 border-black object-cover sm:h-36",
                layout === "list" && "md:h-32 md:w-32 md:flex-none md:border-b-0 md:border-r-2 md:bg-white md:object-contain md:p-2",
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
                <p className="text-sm font-black text-orange-600">{priceTeaser(product.price)}</p>
                <span className="neo-button bg-black px-2.5 py-1.5 text-xs text-white">Detail</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={closeProduct}>
          <div
            className="neo-modal w-full max-w-3xl bg-white p-4 md:p-5"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="rounded-full border-2 border-black bg-yellow px-3 py-1 text-[11px] font-black uppercase shadow-neo-sm">
                Detail pilihan affiliate
              </p>
              <button type="button" onClick={closeProduct} className="neo-button bg-pink p-2 cursor-pointer" aria-label="Tutup modal">
                <X className="size-4" />
              </button>
            </div>

            {isModalLoading ? (
              <ModalSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-[1fr_1.05fr]">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="h-64 w-full rounded-xl border-2 border-black object-cover md:h-full" />
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full border-2 border-black bg-pink px-3 py-1 text-[10px] font-black uppercase shadow-neo-sm">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-black leading-tight md:text-3xl">{selectedProduct.name}</h2>
                    {selectedProduct.description ? <p className="text-sm font-bold leading-relaxed text-zinc-700">{selectedProduct.description}</p> : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border-2 border-black bg-yellow p-3 shadow-neo-sm">
                      <p className="text-[10px] font-black uppercase">Harga</p>
                      <p className="text-lg font-black text-orange-600">{priceTeaser(selectedProduct.price)}</p>
                    </div>
                    <div className="rounded-xl border-2 border-black bg-sky p-3 shadow-neo-sm">
                      <p className="text-[10px] font-black uppercase">Status</p>
                      <p className="text-lg font-black">{selectedProduct.isFeatured ? "Rekomendasi" : "Pilihan"}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-black bg-lime p-3 text-xs font-black shadow-neo-sm">
                    Harga dan promo bisa berubah di Shopee. Klik tombol untuk cek voucher, varian, dan harga terbaru.
                  </div>

                  <a
                    className="neo-button mt-auto bg-black px-4 py-3 text-sm text-white"
                    href={selectedProduct.affiliateUrl}
                    target="_blank"
                    rel="noreferrer sponsored noopener"
                  >
                    Cek Deal di Shopee <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}









