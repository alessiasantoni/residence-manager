"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@prisma/client";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 2l14 14M16 2L2 16" />
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M0 1h18M0 7h18M0 13h18" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <nav className="absolute right-0 top-14 z-20 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft shadow-xl">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-ink hover:bg-ink/5"
            >
              Home
            </Link>
            <div className="border-t border-ink/10" />
            {categories.map((category) => {
              const href = category.slug === "assistenza" ? "/assistenza" : `/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-ink hover:bg-ink/5"
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
