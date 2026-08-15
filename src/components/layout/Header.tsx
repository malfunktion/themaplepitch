import Link from "next/link";
import Image from "next/image";
import { getLiveTicker } from "@/lib/data/standings";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks"; // 1. Import our active navigation component

export default async function Header() {
  const ticker = await getLiveTicker();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      {/* Live ticker strip with automatic light/dark mode color inversion */}
      <div className="overflow-x-auto border-b border-border bg-charcoal dark:bg-white transition-colors">
        <div className="flex items-center gap-6 px-4 py-1.5 text-xs font-medium text-white dark:text-neutral-900 whitespace-nowrap">
          {ticker.map((match) => (
            <div key={match.id} className="flex items-center gap-2">
              <span className="text-neutral-400 dark:text-neutral-500">
                {match.competition}
              </span>
              <span>
                {match.homeTeam} {match.homeScore}-{match.awayScore}{" "}
                {match.awayTeam}
              </span>
              {match.isLive ? (
                <span className="flex items-center gap-1 text-crimson">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-live-pulse" />
                  {match.minute}&apos;
                </span>
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500">
                  Upcoming
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {/* Black SVG logo for light mode */}
          <Image
            src="/blacklogo.svg"
            alt="The Maple Pitch Logo"
            width={24}
            height={24}
            unoptimized
            className="h-6 w-6 object-contain block dark:hidden"
          />
          {/* White SVG logo for dark mode */}
          <Image
            src="/whitelogo.svg"
            alt="The Maple Pitch Logo"
            width={24}
            height={24}
            unoptimized
            className="h-6 w-6 object-contain hidden dark:block"
          />
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            THE <span className="text-crimson">MAPLE PITCH</span>
          </span>
        </Link>

        {/* 2. Replaced static nav with active-state aware NavLinks component */}
        <NavLinks />

        <span
          title="Coming soon"
          aria-disabled="true"
          className="hidden shrink-0 cursor-not-allowed whitespace-nowrap rounded-sm bg-crimson/50 px-4 py-2 text-sm font-semibold text-white/70 lg:inline-block"
        >
          Become a Supporter
        </span>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
