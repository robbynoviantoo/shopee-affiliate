import { FolderPlus, PlusCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { CategoryCombobox } from "@/components/category-combobox";
import { deleteCategoryAction, deleteProductAction, loginAction, saveCategoryAction, saveProductAction } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; edit?: string }>;

function Field({ label, name, defaultValue, type = "text", required = false, list }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; list?: string }) {
  return (
    <label className="block space-y-2 font-black">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} list={list} className="neo-input w-full px-4 py-3 font-bold" />
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

  return (
    <main className="min-h-screen bg-cream px-4 py-6 text-black md:px-8">
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
        </div><div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <form action={saveProductAction} className="neo-panel space-y-5 bg-white p-6">
              <div className="flex items-center gap-3">
                <PlusCircle className="size-7" />
                <h2 className="text-2xl font-black">{editingProduct ? "Edit Produk" : "Tambah Produk"}</h2>
              </div>
              <input type="hidden" name="id" value={editingProduct?.id ?? ""} />
              <Field label="Nama Produk" name="name" defaultValue={editingProduct?.name} required />
              <CategoryCombobox categories={categories} defaultValue={editingProduct?.category} />
              <Field label="Harga/Teks Harga" name="price" defaultValue={editingProduct?.price} />
              <label className="block space-y-2 font-black">
                <span>Deskripsi</span>
                <textarea name="description" defaultValue={editingProduct?.description ?? ""} className="neo-input min-h-28 w-full px-4 py-3 font-bold" />
              </label>
              <Field label="URL Foto" name="imageUrl" defaultValue={editingProduct?.imageUrl} type="url" required />
              <Field label="Link Shopee Affiliate" name="affiliateUrl" defaultValue={editingProduct?.affiliateUrl} type="url" required />
              <Field label="Urutan" name="sortOrder" defaultValue={editingProduct?.sortOrder ?? 0} type="number" />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="neo-input justify-start bg-lime px-4 py-3"><input name="isFeatured" type="checkbox" defaultChecked={editingProduct?.isFeatured ?? false} /> Unggulan</label>
                <label className="neo-input justify-start bg-sky px-4 py-3"><input name="isActive" type="checkbox" defaultChecked={editingProduct?.isActive ?? true} /> Aktif</label>
              </div>
              <button className="neo-button w-full bg-orange px-5 py-4" type="submit">Simpan Produk</button>
              {editingProduct ? <a href="/admin" className="block text-center font-black underline">Batal edit</a> : null}
            </form>

            <div className="neo-panel space-y-4 bg-white p-6">
              <div className="flex items-center gap-3">
                <FolderPlus className="size-7" />
                <h2 className="text-2xl font-black">Kategori</h2>
              </div>
              <p className="text-sm font-bold text-zinc-700">Kelola daftar kategori untuk dropdown dan filter produk.</p>
              <form action={saveCategoryAction} className="space-y-3">
                <input name="categoryName" placeholder="Contoh: Gadget Murah" className="neo-input w-full px-4 py-3 font-bold" required />
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input name="categorySortOrder" type="number" placeholder="Urutan" className="neo-input min-w-0 px-4 py-3 font-bold" />
                  <button className="neo-button bg-yellow px-4 py-3" type="submit">Tambah</button>
                </div>
              </form>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-pink px-3 py-2 text-sm font-black shadow-neo-sm">
                    <span>{category.name}</span>
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <button type="submit" className="neo-button bg-white px-2 py-1 text-xs">Hapus</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                    <button className="neo-button bg-pink px-4 py-3" type="submit">Hapus</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}








