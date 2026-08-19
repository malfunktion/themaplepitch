"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Play, Mic, Radio, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// --- MOCK DATA (This will be replaced by Sanity GROQ Queries) ---

const HERO_DATA = {
  isLive: true,
  title: "Barton Street Battalion: Forge FC vs. Supra du Québec",
  description: "Join the independent watch-along live from Tim Hortons Field. Analyzing tactics, substitutions, and atmosphere in real-time.",
  creator: "Barton St. Battalion",
  bgImage: "https://images.unsplash.com/photo-1518605368461-1ee7c684e27f?auto=format&fit=crop&q=80&w=1600",
};

const TICKER_DATA = [
  { time: "Today, 7:00 PM", title: "CPL: Forge FC vs. FC Supra du Québec (OneSoccer)" },
  { time: "Today, 7:30 PM", title: "NSL: Halifax Tides FC vs. AFC Toronto" },
  { time: "Tomorrow, 10:00 AM", title: "Footy Prime: Weekly Analysis (New Episode)" },
  { time: "Sat, 2:00 PM", title: "League1: Vancouver Vlogs (Watch-Along)" },
];

const VIDEO_CATEGORIES = [
  {
    title: "Live & Upcoming",
    items: Array(5).fill({ title: "Live Watch-Along: Cavalry FC", thumb: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=400" })
  },
  {
    title: "Tactical Breakdowns",
    items: Array(5).fill({ title: "How CPL defenses are shifting", thumb: "https://images.unsplash.com/photo-1551280857-2b9eb02bfa12?auto=format&fit=crop&q=80&w=400" })
  }
];

const PODCASTS = Array(4).fill({
  title: "Footy Prime",
  episode: "The Shield Race is heating up...",
  creator: "James Sharman",
  isNew: true
});

// --- COMPONENTS ---

const VideoCarousel = ({ title, items }: { title: string, items: any[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true });
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white px-8 mb-6">{title}</h2>
      <div className="overflow-hidden px-8" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex-[0_0_280px] group cursor-pointer">
              <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700">
                <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-zinc-300">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function MediaHub() {
  return (
    <div className="bg-black min-h-screen text-white pb-20">
      
      {/* 1. HERO BILLBOARD */}
      <div className="relative h-[70vh] flex items-end p-8 md:p-16">
        <img src={HERO_DATA.bgImage} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          {HERO_DATA.isLive && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex w-max items-center gap-2 mb-4 animate-pulse">
              <Radio className="w-4 h-4" /> Live Now
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-black mb-4">{HERO_DATA.title}</h1>
          <p className="text-lg text-zinc-300 mb-8">{HERO_DATA.description}</p>
          <div className="flex gap-4">
            <button className="bg-white text-black px-8 py-3 font-bold rounded hover:bg-zinc-200">Watch Now</button>
            <button className="bg-zinc-800 text-white px-8 py-3 font-bold rounded hover:bg-zinc-700">View Match Center</button>
          </div>
        </div>
      </div>

      {/* 2. TICKER */}
      <div className="bg-zinc-900 py-3 border-y border-zinc-800 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-12 text-sm font-medium">
          {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-red-500 font-bold">{item.time}</span>
              <span className="text-zinc-500">|</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. VIDEO SECTIONS */}
      <div className="mt-12">
        {VIDEO_CATEGORIES.map((cat, i) => (
          <VideoCarousel key={i} title={cat.title} items={cat.items} />
        ))}
      </div>

      {/* 4. PODCAST GRID */}
      <section className="px-8 mt-16">
        <div className="flex items-center gap-4 mb-8">
          <Mic className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold">Audio & Podcasts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PODCASTS.map((pod, i) => (
            <div key={i} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors">
              <div className="flex justify-between mb-4">
                <span className="text-red-500 text-xs font-bold">NEW EPISODE</span>
              </div>
              <h3 className="font-bold text-lg">{pod.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{pod.episode}</p>
              <button className="mt-6 flex items-center gap-2 text-sm font-semibold text-white bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700">
                <Play className="w-4 h-4 fill-white" /> Listen Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Global CSS Inject for Marquee */}
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
}
