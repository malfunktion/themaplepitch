'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/the-wire", label: "The Wire" },
  { href: "/pro-leagues", label: "Pro Leagues" },
  { href: "/provincial-leagues", label: "Provincial Leagues" },
  { href: "/national-teams", label: "National Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/players", label: "Players" },
  { href: "/matches", label: "Matches" },
  { href: "/scout-terminal", label: "Scout" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center flex-nowrap gap-1 lg:gap-2 xl:gap-4 text-sm font-medium lg:flex">
      {NAV_LINKS.map((link) => {
        // Match exact '/' for home, or startsWith for sub-pages (e.g., /pro-leagues/cpl)
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-1.5 py-1 rounded-sm text-xs font-mono whitespace-nowrap shrink-0 transition-colors ${
              isActive
                ? "bg-crimson text-white shadow-sm font-bold"
                : "text-charcoal-soft hover:text-crimson"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
