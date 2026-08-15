"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/the-wire", label: "The Wire" },
  { href: "/pro-leagues", label: "Pro Leagues" },
  { href: "/provincial-leagues", label: "Provincial Leagues" },
  { href: "/national-teams", label: "National Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/scout-terminal", label: "Scout Terminal" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-charcoal transition-transform ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-charcoal transition-opacity ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-charcoal transition-transform ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <nav id="mobile-navigation" className="absolute left-0 right-0 top-full flex flex-col border-b border-border bg-surface px-4 py-2 shadow-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-border py-3 text-sm font-medium text-charcoal-soft last:border-0 hover:text-crimson"
            >
              {link.label}
            </Link>
          ))}
          <span
            title="Coming soon"
            aria-disabled="true"
            className="my-3 cursor-not-allowed rounded-sm bg-crimson/50 px-4 py-2 text-center text-sm font-semibold text-white/70"
          >
            Become a Supporter
          </span>
        </nav>
      )}
    </div>
  );
}
