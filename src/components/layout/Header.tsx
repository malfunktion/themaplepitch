import Link from "next/link";
import { getLiveTicker } from "@/lib/data/standings";
import MobileNav from "./MobileNav";

const NAV_LINKS = [
  { href: "/the-wire", label: "The Wire" },
  { href: "/pro-leagues", label: "Pro Leagues" },
  { href: "/provincial-leagues", label: "Provincial Leagues" },
  { href: "/national-teams", label: "National Teams" },
  { href: "/stats", label: "Stats" },
];

export default async function Header() {
  const ticker = await getLiveTicker();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      {/* Live ticker strip */}
      <div className="overflow-x-auto border-b border-border bg-charcoal">
        <div className="flex items-center gap-6 px-4 py-1.5 text-xs font-medium text-white whitespace-nowrap">
          {ticker.map((match) => (
            <div key={match.id} className="flex items-center gap-2">
              <span className="text-charcoal-soft">{match.competition}</span>
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
                <span className="text-charcoal-soft">Upcoming</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            THE <span className="text-crimson">MAPLE PITCH</span>
          </span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-charcoal-soft transition-colors hover:text-crimson"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/supporter"
          className="hidden rounded-md bg-crimson px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-crimson-dim md:inline-block"
        >
          Become a Supporter
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}
