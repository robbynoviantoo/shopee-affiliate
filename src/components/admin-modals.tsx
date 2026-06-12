"use client";

import { FolderPlus, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CategoryCombobox } from "@/components/category-combobox";
import { saveCategoryAction, saveProductAction } from "@/app/admin/actions";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

type Category = {
  id: string;
  name: string;
  sortOrder: number;
};

function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean }) {
  return (
    <label className="block space-y-2 font-black">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} className="neo-input w-full px-4 py-3 font-bold" />
    </label>
  );
}

function ModalShell({ title, icon, isOpen, onClose, children }: { title: string; icon: React.ReactNode; isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="neo-modal custom-scrollbar max-h-[90vh] w-full max-w-xl overflow-auto bg-white p-5" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="neo-button bg-pink p-2 cursor-pointer" aria-label="Tutup modal">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function AdminModals({ categories, editingProduct }: { categories: Category[]; editingProduct?: Product | null }) {
  const [isProductOpen, setIsProductOpen] = useState(Boolean(editingProduct));
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  function clearEditUrl() {
    if (editingProduct) window.history.replaceState(null, "", "/admin");
  }

  function closeProductModal() {
    setIsProductOpen(false);
    clearEditUrl();
  }

  function openCreateProduct() {
    window.history.replaceState(null, "", "/admin");
    setIsProductOpen(true);
  }

  const productFormKey = editingProduct?.id ?? "create";

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={openCreateProduct} className="neo-button bg-orange px-5 py-3">
          <PlusCircle className="size-5" /> Tambah Produk
        </button>
        <button type="button" onClick={() => setIsCategoryOpen(true)} className="neo-button bg-yellow px-5 py-3">
          <FolderPlus className="size-5" /> Kategori
        </button>
      </div>

      <ModalShell title={editingProduct ? "Edit Produk" : "Tambah Produk"} icon={<PlusCircle className="size-7" />} isOpen={isProductOpen} onClose={closeProductModal}>
        <form key={productFormKey} action={saveProductAction} className="space-y-5">
          <input type="hidden" name="id" value={editingProduct?.id ?? ""} />
          <Field label="Nama Produk" name="name" defaultValue={editingProduct?.name} required />
          <CategoryCombobox key={editingProduct?.id ?? "create-category"} categories={categories} defaultValue={editingProduct?.category} />
          <Field label="Harga/Teks Harga" name="price" defaultValue={editingProduct?.price} />
          <label className="block space-y-2 font-black">
            <span>Deskripsi</span>
            <textarea name="description" defaultValue={editingProduct?.description ?? ""} className="neo-input min-h-28 w-full px-4 py-3 font-bold" />
          </label>
          <Field label="URL Foto" name="imageUrl" defaultValue={editingProduct?.imageUrl ?? "https://picsum.photos/id/10/800/500"} type="url" required />
          <Field label="Link Shopee Affiliate" name="affiliateUrl" defaultValue={editingProduct?.affiliateUrl} type="url" required />
          <Field label="Urutan" name="sortOrder" defaultValue={editingProduct?.sortOrder ?? 0} type="number" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="neo-input justify-start bg-lime px-4 py-3"><input name="isFeatured" type="checkbox" defaultChecked={editingProduct?.isFeatured ?? false} /> Unggulan</label>
            <label className="neo-input justify-start bg-sky px-4 py-3"><input name="isActive" type="checkbox" defaultChecked={editingProduct?.isActive ?? true} /> Aktif</label>
          </div>
          <button className="neo-button w-full bg-orange px-5 py-4" type="submit">Simpan Produk</button>
          {editingProduct ? <button type="button" onClick={closeProductModal} className="block w-full text-center font-black underline">Batal edit</button> : null}
        </form>
      </ModalShell>

      <ModalShell title="Kategori" icon={<FolderPlus className="size-7" />} isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)}>
        <p className="mb-4 text-sm font-bold text-zinc-700">Kelola daftar kategori untuk dropdown dan filter produk.</p>
        <form action={saveCategoryAction} className="space-y-3">
          <input name="categoryName" placeholder="Contoh: Gadget Murah" className="neo-input w-full px-4 py-3 font-bold" required />
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <input name="categorySortOrder" type="number" placeholder="Urutan" className="neo-input min-w-0 px-4 py-3 font-bold" />
            <button className="neo-button bg-yellow px-4 py-3" type="submit">Tambah</button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

