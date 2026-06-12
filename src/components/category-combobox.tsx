"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

type CategoryOption = {
  id: string;
  name: string;
};

export function CategoryCombobox({ categories, defaultValue }: { categories: CategoryOption[]; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(normalizedValue));
  }, [categories, value]);

  return (
    <label className="space-y-2 font-black">
      <span>Kategori</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" />
        <input
          name="category"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder="Cari / tulis kategori..."
          required
          className="neo-input w-full px-4 py-3 pl-11 font-bold"
        />
        {isOpen ? (
          <div className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-56 w-full overflow-auto rounded-xl border-2 border-black bg-white p-2 shadow-neo-sm">
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setValue(category.name);
                    setIsOpen(false);
                  }}
                  className={clsx("mb-1 w-full rounded-lg border-2 border-transparent px-3 py-2 text-left text-sm font-black", value === category.name ? "border-black bg-orange" : "hover:border-black hover:bg-yellow")}
                >
                  {category.name}
                </button>
              ))
            ) : (
              <div className="rounded-lg border-2 border-black bg-lime px-3 py-2 text-xs font-black">
                Kategori baru akan otomatis dibuat.
              </div>
            )}
          </div>
        ) : null}
      </div>
      <p className="text-xs font-bold text-zinc-600">Cari kategori yang sudah ada, atau ketik kategori baru.</p>
    </label>
  );
}
