"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Play, Mic, Radio, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// --- MOCK DATA ---

const TICKER_ITEMS = [
  { time: "Today, 7:00 PM", title: "Forge FC vs. FC Supra du Québec (OneSoccer)" },
  { time: "Today, 7:00 PM", title: "Atlético Ottawa vs. Vancouver FC (OneSoccer)" },
  { time: "Tomorrow, 9:00 AM", title: "NSL: Halifax Tides FC vs. AFC Toronto" },
  { time: "Tomorrow, 12:00 PM", title: "NSL: Montreal Roses FC vs. Calgary Wild FC" },
  { time: "Fri, 4:00 PM", title: "Footy Prime: Weekend Preview Drop" },
];

const HERO_FEATURE = {
  isLive: true,
  title: "LIVE WATCH-ALONG: Barton Street Battalion",
  subtitle: "Forge FC vs. FC Supra du Québec - Matchday 17",
  creator: "Barton St. Battalion",
  platform: "Twitch",
  image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600",
};

const VOD_ROWS = [
  {
    category: "Latest NSL Highlights",
    items: [
      { id: 1, title: "Montreal Roses FC vs. Vancouver Rise FC", duration: "8:45", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600" },
      { id: 2, title: "AFC Toronto claims victory over Ottawa Rapid FC", duration: "10:12", image: "https://images.unsplash.com/photo-1551280857-2b9eb02bfa12?auto=format&fit=crop&q=80&w=600" },
      { id: 3, title: "Halifax Tides FC Ground VLOG", duration: "15:30", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600" },
      { id: 4, title: "Calgary Wild FC - Tactical Breakdown", duration: "12:05", image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=600" },
    ],
  },
  {
    category: "CPL Matchweek 17 Recap",
    items: [
      { id: 5, title: "Inter Toronto FC stuns Halifax Wanderers", duration: "7:30", image: "https://images.unsplash.com/photo-1431324155629-1a6d0a11f44e?auto=format&fit=crop&q=80&w=600" },
      { id: 6, title: "Cavalry FC leaps Forge in Shield Race", duration: "9:15", image: "https://images.unsplash.com/photo-1600250395350-13bc1508db9c?auto=format&fit=crop&q=80&w=600" },
      { id: 7, title: "Vancouver FC rescues point vs Pacific FC", duration: "6:48", image: "https://images.unsplash.com/photo-1553152531-6ec86be3cb7c?auto=format&fit=crop&q=80&w=600" },
      { id: 8, title: "Atlético Ottawa late strike vs Supra du Québec", duration: "8:05", image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cb394?auto=format&fit=crop&q=80&w=600" },
    ],
  },
];

const PODCASTS = [
  { id: 101, title: "Footy Prime", episode: "The CPL Shield Race Heats Up", creator: "James Sharman & Crew", isNew: true },
  { id: 102, title: "Northern Fútbol", episode: "CanMNT World Cup Roster Projections", creator: "Ben Steiner", isNew: false },
  { id: 103, title: "CPL Newsroom", episode: "Matchweek 17 Review & Analysis", creator: "Charlie & Mitchell", isNew: true },
  { id: 104, title: "The Third Sub", episode: "Vancouver Rise FC Mid-Season Grades", creator: "West Coast Fans", isNew: false },
];

// --- COMPONENTS ---

const Ticker = () => (
  <div className="bg-zinc-900 border-y border-zinc-800 flex items-center overflow-hidden whitespace-nowrap py-2.5 text-sm my-6">
    <div className="bg-red-600 text-white font-bold px-4 py-1 flex items-center gap-2 z-10 shrink-0 shadow-lg">
      <Calendar className="w-4 h-4" /> UPCOMING
    </div>
    <div className="flex animate-marquee pl-4 gap-8 text-zinc-300">
      {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          <span className="font-semibold text-zinc-100">{item.time}</span>
          <span className="text-zinc-500">•</span>
          {item.title}
        </span>
      ))}
    </div>
  </div>
);

const VideoCarousel = ({ category, items }: { category: string, items: any[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="mb-10 group px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{category}</h2>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={scrollNext} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_260px] sm:flex-[0_0_300px] min-w-0 relative group cursor-pointer">
              <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-800 group-hover:border-zinc-500 transition-all">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-red-600 rounded-full p-3"><Play className="w-5 h-5 text-white fill-white" /></div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs font-semibold text-white rounded">
                  {item.duration}
                </div>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-zinc-200 line-clamp-2 group-hover:text-white">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FanHubMediaPage() {
  return (
    <div className="w-full min-h-screen bg-black font-sans pb-20 text-white">
      
      {/* 1. HERO BILLBOARD */}
      <div className="relative w-full min-h-[480px] h-[55vh] flex items-end rounded-2xl overflow-hidden border border-zinc-800">
        {/* Background Image with Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%), url(${HERO_FEATURE.image})` 
          }}
        />
        
        <div className="relative z-10 p-6 md:p-10 max-w-3xl">
          {HERO_FEATURE.isLive && (
            <div className="flex items-center gap-2 mb-3 bg-red-600/90 text-white px-3 py-1 rounded-full w-max text-xs font-bold tracking-wider animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              LIVE NOW
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
            {HERO_FEATURE.title}
          </h1>
          <p className="text-sm md:text-base text-zinc-300 mb-6 font-medium">
            {HERO_FEATURE.subtitle} • <span className="text-red-400">{HERO_FEATURE.creator}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-colors text-sm">
              <Play className="w-4 h-4 fill-white" />
              Watch {HERO_FEATURE.platform} Stream
            </button>
            <button className="bg-zinc-800/90 text-white border border-zinc-700 px-5 py-2.5 rounded-lg font-bold hover:bg-zinc-700 transition-colors text-sm">
              Match Center
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROGRAMMING TICKER */}
      <Ticker />

      {/* 3. VIDEO ROWS */}
      <div className="mt-6">
        {VOD_ROWS.map((row, idx) => (
          <VideoCarousel key={idx} category={row.category} items={row.items} />
        ))}
      </div>

      {/* 4. PODCAST GRID */}
      <div className="px-4 md:px-8 mt-12">
        <div className="flex items-center gap-2.5 mb-6">
          <Mic className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-white tracking-tight">Audio & Podcasts</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PODCASTS.map((pod) => (
            <div key={pod.id} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-400 transition-colors">{pod.title}</h3>
                  {pod.isNew && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-medium line-clamp-2 mb-1">{pod.episode}</p>
                <p className="text-[11px] text-zinc-500">{pod.creator}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center">
                <button className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </button>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}
