import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminModals } from "@/components/admin-modals";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { deleteCategoryAction, deleteProductAction, loginAction } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; edit?: string }>;

function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean }) {
  return (
    <label className="block space-y-2 font-black">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} className="neo-input w-full px-4 py-3 font-bold" />
    </label>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream p-4">
        <form action={loginAction} className="neo-panel w-full max-w-md space-y-6 bg-white p-8">
          <div className="space-y-3">
            <ShieldCheck className="size-12" />
            <h1 className="text-4xl font-black">Admin Login</h1>
            <p className="font-bold text-zinc-700">Masukkan password admin untuk kelola link affiliate.</p>
          </div>
          {params.error ? <p className="rounded-xl border-3 border-black bg-pink p-3 font-black">{params.error}</p> : null}
          <div className="mb-5">
            <Field label="Password" name="password" type="password" required />
          </div>
          <button className="neo-button w-full bg-yellow px-5 py-4" type="submit">Masuk Dashboard</button>
        </form>
      </main>
    );
  }

  const prisma = process.env.DATABASE_URL ? (await import("@/lib/prisma")).prisma : null;
  const products = prisma ? await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }) : [];
  const categories = prisma ? await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }) : [];
  const editingProduct = products.find((product) => product.id === params.edit);
  const hasAnalyticsModels = Boolean(prisma?.visit && prisma?.productClick);
  const [visitCount, clickCount, uniqueVisitors, recentVisits, topClicks] = hasAnalyticsModels && prisma
    ? await Promise.all([
        prisma.visit.count(),
        prisma.productClick.count(),
        prisma.visit.groupBy({ by: ["ipAddress"], where: { ipAddress: { not: null } } }),
        prisma.visit.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
        prisma.productClick.groupBy({ by: ["productId", "productName"], _count: { productId: true }, orderBy: { _count: { productId: "desc" } }, take: 3 }),
      ])
    : [0, 0, [], [], []];

  return (
    <main className="page-enter min-h-screen bg-cream px-4 py-6 text-black md:px-8">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="neo-panel flex flex-col gap-4 bg-yellow p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black uppercase">Dashboard</p>
            <h1 className="text-4xl font-black md:text-5xl">Kelola Produk Affiliate</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="neo-button bg-white px-5 py-3">Lihat Website</Link>
            <a href="/admin/logout" className="neo-button bg-black px-5 py-3 text-white">Logout</a>
          </div>
        </div>

        <AdminModals categories={categories} editingProduct={editingProduct} />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="neo-panel bg-white p-5">
            <p className="text-xs font-black uppercase text-zinc-600">Total Kunjungan</p>
            <p className="mt-2 text-4xl font-black">{visitCount}</p>
          </div>
          <div className="neo-panel bg-lime p-5">
            <p className="text-xs font-black uppercase text-zinc-700">Unique IP</p>
            <p className="mt-2 text-4xl font-black">{uniqueVisitors.length}</p>
          </div>
          <div className="neo-panel bg-sky p-5">
            <p className="text-xs font-black uppercase text-zinc-700">Klik Produk</p>
            <p className="mt-2 text-4xl font-black">{clickCount}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="neo-panel bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Produk Paling Sering Diklik</h2>
              <Link href="/admin/analytics" className="neo-button bg-yellow px-3 py-2 text-sm">Lihat selengkapnya</Link>
            </div>
            <div className="mt-4 space-y-3">
              {topClicks.length ? topClicks.map((item) => (
                <div key={`${item.productId}-${item.productName}`} className="flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-yellow px-3 py-2 font-black shadow-neo-sm">
                  <span className="line-clamp-1">{item.productName}</span>
                  <span>{item._count.productId} klik</span>
                </div>
              )) : <p className="font-bold text-zinc-600">Belum ada klik produk.</p>}
            </div>
          </div>

          <div className="neo-panel bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Pengunjung Terbaru</h2>
              <Link href="/admin/analytics" className="neo-button bg-yellow px-3 py-2 text-sm">Lihat selengkapnya</Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentVisits.length ? recentVisits.map((visit) => (
                <div key={visit.id} className="rounded-xl border-2 border-black bg-cream p-3 text-xs font-bold shadow-neo-sm">
                  <div className="flex flex-wrap justify-between gap-2 font-black">
                    <span>{visit.ipAddress || "IP tidak tersedia"}</span>
                    <span>{visit.createdAt.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="mt-1">{visit.device || "Unknown"} - {visit.browser || "Unknown"} - {visit.os || "Unknown"}</p>
                  <p className="mt-1">Path: {visit.path}</p>
                  <p className="mt-1">Lokasi: {[visit.city, visit.country].filter(Boolean).join(", ") || "Tidak tersedia"}</p>
                </div>
              )) : <p className="font-bold text-zinc-600">Belum ada data kunjungan.</p>}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {products.map((product) => (
              <article key={product.id} className="neo-card flex flex-col gap-4 bg-white p-4 md:flex-row md:items-center">
                <img src={product.imageUrl} alt={product.name} className="h-28 w-full rounded-xl border-3 border-black object-cover md:w-32" />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
                    <span className="rounded-full border-3 border-black bg-pink px-3 py-1">{product.category}</span>
                    {!product.isActive ? <span className="rounded-full border-3 border-black bg-zinc-200 px-3 py-1">Nonaktif</span> : null}
                    {product.isFeatured ? <span className="rounded-full border-3 border-black bg-lime px-3 py-1">Unggulan</span> : null}
                  </div>
                  <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                  <p className="font-bold text-zinc-700">{product.price || "Tanpa harga"}</p>
                </div>
                <div className="flex gap-3">
                  <a href={`/admin?edit=${product.id}`} className="neo-button bg-yellow px-4 py-3">Edit</a>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <ConfirmDeleteButton message={`Yakin hapus produk "${product.name}"?`} />
                  </form>
                </div>
              </article>
            ))}
          </div>

          <div className="neo-panel h-fit space-y-3 bg-white p-5">
            <h2 className="text-2xl font-black">Kategori</h2>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-pink px-3 py-2 text-sm font-black shadow-neo-sm">
                <span>{category.name}</span>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmDeleteButton label="Hapus" message={`Yakin hapus kategori "${category.name}"? Produk lama tidak ikut terhapus, tapi filter kategorinya bisa terdampak.`} />
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}



