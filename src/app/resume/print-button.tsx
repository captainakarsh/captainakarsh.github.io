"use client";

import { Printer } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
    >
      <Printer size={16} /> Save as PDF
    </button>
  );
}
