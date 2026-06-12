"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export function ConfirmDeleteButton({ label = "Hapus", message }: { label?: string; message: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  return (
    <>
      <button
        className="neo-button bg-pink px-4 py-3"
        type="submit"
        onClick={(event) => {
          if (shouldSubmit) return;
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        {label}
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[10000] flex min-h-dvh items-center justify-center bg-black/60 p-4" onClick={() => setIsOpen(false)}>
              <div className="neo-modal w-full max-w-md bg-white p-5" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Konfirmasi hapus">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border-2 border-black bg-pink p-2 shadow-neo-sm">
                      <AlertTriangle className="size-6" />
                    </div>
                    <h2 className="text-2xl font-black">Yakin hapus?</h2>
                  </div>
                  <button type="button" onClick={() => setIsOpen(false)} className="neo-button bg-white p-2" aria-label="Tutup konfirmasi">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="rounded-xl border-2 border-black bg-cream p-3 text-sm font-bold shadow-neo-sm">{message}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setIsOpen(false)} className="neo-button bg-white px-4 py-3">
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      const form = event.currentTarget.closest("form");
                      setShouldSubmit(true);
                      setIsOpen(false);
                      window.setTimeout(() => form?.requestSubmit(), 0);
                    }}
                    className="neo-button bg-pink px-4 py-3"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
