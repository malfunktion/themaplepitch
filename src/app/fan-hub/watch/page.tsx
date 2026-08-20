"use client";

import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Play,
  Mic,
  Radio,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Tv,
  Clock,
  Video,
  Users,
  Bell
} from "lucide-react";

// ==========================================
// MOCK DATA: FAN & CREATOR CONTENT
// ==========================================

const HERO_FEATURE = {
  _id: "hero-1",
  isLive: true,
  title: "Barton Street Battalion: Forge FC vs. FC Supra du Québec",
  subtitle: "Live Matchday 17 Watch Party & Fan Commentary",
  creator: { name: "Barton St. Battalion", handle: "@BartonBattalion", platform: "YouTube" },
  platform: "youtube",
  embedId: "jfKfPfyJRkM", 
};

// --- MAPLEPITCH LIVE GUIDE MOCK DATA ---
const TV_GUIDE_DATA: Record<string, any[]> = {
  "Today": [
    { id: "t1", time: "3:00 PM", title: "CanMNT Roster Reveal Reaction", creator: "The Boys On The Field", type: "Live Stream", platform: "YouTube", status: "upcoming" },
    { id: "t2", time: "7:00 PM", title: "Barton St. Battalion Live Stream", creator: "Barton St. Battalion", type: "Watch-Along", platform: "YouTube", status: "live" },
    { id: "t3", time: "7:30 PM", title: "Capital City Supporters: Away Day Watch", creator: "Capital City Supporters", type: "Watch-Along", platform: "Twitch", status: "upcoming" }
  ],
  "Tomorrow": [
    { id: "t4", time: "9:00 AM", title: "Whitecaps & VFC Weekend Preview", creator: "AFTN", type: "Podcast Stream", platform: "YouTube", status: "upcoming" },
    { id: "t5", time: "12:00 PM", title: "NSL Matchday Build-up", creator: "Northern Tribune", type: "VOD Premiere", platform: "YouTube", status: "upcoming" },
    { id: "t6", time: "6:00 PM", title: "L1O Match of the Week Watch Party", creator: "League1 Fans", type: "Watch-Along", platform: "Twitch", status: "upcoming" }
  ],
  "Friday": [
    { id: "t7", time: "4:00 PM", title: "Footy Prime: Matchweek 17 Breakdown", creator: "Footy Prime", type: "Live Show", platform: "YouTube", status: "upcoming" },
    { id: "t8", time: "5:30 PM", title: "Tactical Breakdown: Forge's Midfield", creator: "Tactical Maple", type: "VOD Premiere", platform: "YouTube", status: "upcoming" }
  ],
  "Saturday": [
    { id: "t9", time: "1:00 PM", title: "Wanderers Grounds Tailgate Vlog", creator: "East Coast Footy", type: "VOD Drop", platform: "YouTube", status: "upcoming" },
    { id: "t10", time: "2:00 PM", title: "Privateers 1882: Away Stream", creator: "Privateers FC", type: "Watch-Along", platform: "Twitch", status: "upcoming" }
  ]
};

const SCHEDULE_DAYS = Object.keys(TV_GUIDE_DATA);

const CONTENT_SECTIONS = [
  {
    id: "creator-highlights",
    title: "🔥 Creator Highlights",
    subtitle: "Top clips, viral moments, and standout features from the community",
    items: [
      { id: "h1", title: "Incredible 90-yard solo run goal in League1 Ontario", creator: "Grassroots Canada", duration: "1:15", tag: "Highlight", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600" },
      { id: "h2", title: "Supporter section reaction to stoppage time winner", creator: "Hammer City Ultras", duration: "2:30", tag: "Atmosphere", image: "https://images.unsplash.com/photo-1518605368461-1ee7c684e27f?auto=format&fit=crop&q=80&w=600" },
      { id: "h3", title: "Tactical breakdown of Canada's defensive block", creator: "Tactical Maple", duration: "4:10", tag: "Analysis", image: "https://images.unsplash.com/photo-1551280857-2b9eb02bfa12?auto=format&fit=crop&q=80&w=600" },
      { id: "h4", title: "Post-match player interview with CPL breakout star", creator: "Northern Tribune", duration: "5:00", tag: "Interview", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600" },
      { id: "h5", title: "Top 5 Saves of the NSL Opening Month", creator: "NSL Fan TV", duration: "3:20", tag: "Compilations", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600" },
      { id: "h6", title: "Tailgate culture outside Tim Hortons Field", creator: "Barton St. Battalion", duration: "3:45", tag: "Culture", image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cb394?auto=format&fit=crop&q=80&w=600" },
      { id: "h7", title: "CanMNT player arriving at camp in style", creator: "The Boys On The Field", duration: "1:50", tag: "CanMNT", image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=600" },
      { id: "h8", title: "L1BC rainy derby matchday cinematic vibe", creator: "West Coast Footy", duration: "2:15", tag: "Cinematic", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600" },
    ],
  },
  {
    id: "live-watchalongs",
    title: "🔴 Live Fan Streams & Watch Parties",
    subtitle: "Real-time commentary and reactions from supporter groups across Canada",
    items: [
      { id: "w1", title: "Barton St. Battalion: Forge FC vs FC Supra", creator: "Barton St. Battalion", duration: "LIVE", tag: "Watch Party", image: "https://images.unsplash.com/photo-1518605368461-1ee7c684e27f?auto=format&fit=crop&q=80&w=600" },
      { id: "w2", title: "Lake Side Supporters: Pacific FC Watch Party", creator: "Lake Side Crew", duration: "Starts 8 PM", tag: "Watch Party", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600" },
      { id: "w3", title: "Privateers 1882: Halifax Wanderers Away Stream", creator: "Privateers FC", duration: "Sat 2 PM", tag: "Away Day", image: "https://images.unsplash.com/photo-1431324155629-1a6d0a11f44e?auto=format&fit=crop&q=80&w=600" },
      { id: "w4", title: "The Boys On The Field: CanMNT Roster Reaction", creator: "Boys On The Field", duration: "VOD", tag: "Reaction", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600" },
    ],
  },
  {
    id: "supporter-vlogs",
    title: "Stadium Vlogs & Away Days",
    subtitle: "Groundhopping and matchday experiences from independent creators",
    items: [
      { id: "v1", title: "Away Day Vlog: 500 Halifax Fans Travel to York United", creator: "Wanderers Ground Crew", duration: "22:15", tag: "Vlog", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600" },
      { id: "v2", title: "Inside the Section: Barton St Battalion Pyro & Chants", creator: "Hammer City Ultras", duration: "11:40", tag: "Culture", image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cb394?auto=format&fit=crop&q=80&w=600" },
      { id: "v3", title: "Game Day in Montreal: Wild Atmosphere for Roses FC", creator: "Quebec Footy Vlog", duration: "14:50", tag: "Vlog", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600" },
      { id: "v4", title: "TSS Rovers Home Opener: L1BC Madness", creator: "Swangard Stadium Crew", duration: "16:30", tag: "Grassroots", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600" },
    ],
  },
];

const CREATOR_SPOTLIGHT = {
  creatorName: "Northern Tribune",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  bio: "Independent ground coverage of Canadian soccer news, stadium vlogs, and exclusive player interviews across the CPL, NSL, and League1.",
  platform: "YouTube / Web",
  subscribers: "18.4K Subscribers",
  featuredVideos: [
    { id: "sp1", title: "Exclusive: Inside the FC Supra du Québec Roster Build", duration: "18:20", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600" },
    { id: "sp2", title: "CPL Expansion Update: What's Next for 2027?", duration: "14:15", image: "https://images.unsplash.com/photo-1600250395350-13bc1508db9c?auto=format&fit=crop&q=80&w=600" },
    { id: "sp3", title: "Groundhopping: Visiting Every Canadian Soccer Stadium", duration: "25:40", image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cb394?auto=format&fit=crop&q=80&w=600" },
  ]
};

const PODCASTS = [
  { id: 101, title: "Footy Prime", episode: "Ep 142: CPL Shield Race Tightens & NSL Launch Analysis", creator: "James Sharman, Craig Forrest & Crew", duration: "1h 15m", date: "2 hrs ago", isNew: true, platform: "Spotify" },
  { id: 102, title: "Vocal Minority", episode: "TFC Struggles & CanMNT Roster Debate", creator: "Duncan, Kristin & Mark", duration: "1h 10m", date: "Yesterday", isNew: true, platform: "Apple Podcasts" },
  { id: 103, title: "AFTN (Away From The Numbers)", episode: "Whitecaps Recap & L1BC Playoff Push", creator: "Michael McColl & Zachary Meisenheimer", duration: "58m", date: "Yesterday", isNew: false, platform: "Apple Podcasts" },
  { id: 104, title: "The Third Sub", episode: "Vancouver Rise FC Mid-Season Grades", creator: "Samuel Rowan & Alexandre Gangué-Ruzic", duration: "52m", date: "3 days ago", isNew: false, platform: "Spotify" },
];

const DIRECTORY_CREATORS = [
  { name: "Footy Prime", category: "Flagship Podcast", platform: "Spotify / Apple", followers: "35K+", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200" },
  { name: "AFTN", category: "West Coast Pod", platform: "Apple / Web", followers: "8K+", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200" },
  { name: "Northern Tribune", category: "News & Vlogs", platform: "YouTube", followers: "18K+", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  { name: "The Boys On The Field", category: "Watch Parties & Analysis", platform: "YouTube", followers: "9.5K+", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=200" },
  { name: "Vocal Minority", category: "TFC & CanMNT Pod", platform: "Spotify", followers: "5K+", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200" },
];

// ==========================================
// HELPER COMPONENTS
// ==========================================

const VideoCarousel = ({ section }: { section: typeof CONTENT_SECTIONS[0] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="mb-12 group px-4 md:px-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{section.title}</h2>
          <p className="text-xs md:text-sm text-zinc-400 font-medium">{section.subtitle}</p>
        </div>
        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={scrollPrev} className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={scrollNext} className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-4">
          {section.items.map((item) => (
            <div key={item.id} className="flex-[0_0_260px] sm:flex-[0_0_300px] min-w-0 relative group/card cursor-pointer">
              <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-800 group-hover/card:border-zinc-500 transition-all">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="bg-red-600 rounded-full p-3 shadow-lg"><Play className="w-5 h-5 text-white fill-white" /></div>
                </div>
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-red-400 rounded uppercase border border-white/10">
                  {item.tag}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs font-semibold text-white rounded">
                  {item.duration}
                </div>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-zinc-200 line-clamp-2 group-hover/card:text-white transition-colors">{item.title}</h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">{item.creator}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function FanHubMediaPage() {
  const [selectedDay, setSelectedDay] = useState("Today");

  const renderEmbed = (platform: string, embedId: string) => {
    switch (platform) {
      case "youtube":
        return (
          <iframe
            src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&rel=0`}
            className="w-full h-full absolute inset-0 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      default:
        return <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">Stream Player Loading...</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-black font-sans pb-24 text-white">
      
      {/* 1. CINEMATIC HERO MEDIA STAGE */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 pb-8">
        <div className="w-full max-w-7xl mx-auto aspect-video relative bg-zinc-900 md:rounded-b-2xl overflow-hidden shadow-2xl border-x border-b border-zinc-800">
          {renderEmbed(HERO_FEATURE.platform, HERO_FEATURE.embedId)}
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            {HERO_FEATURE.isLive && (
              <div className="flex items-center gap-2 mb-3 bg-red-600/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-full w-max text-xs font-bold tracking-wider animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                LIVE WATCH-ALONG ON {HERO_FEATURE.platform.toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2">
              {HERO_FEATURE.title}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 font-medium">
              {HERO_FEATURE.subtitle} • <span className="text-zinc-200 font-bold">{HERO_FEATURE.creator.name}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button className="bg-zinc-900 text-white border border-zinc-700 px-5 py-2.5 rounded-lg font-bold hover:bg-zinc-800 transition-colors text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              Live Stream Chat
            </button>
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm shadow-md shadow-red-950">
              Submit Your Content
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAPLEPITCH LIVE GUIDE */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 my-12">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">MaplePitch Live Guide</h2>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              {SCHEDULE_DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {TV_GUIDE_DATA[selectedDay].map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-zinc-800/40 transition-colors group">
                
                <div className="sm:w-32 shrink-0">
                  <div className="text-lg font-black text-white">{item.time}</div>
                  {item.status === "live" ? (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase mt-1">
                      <Radio className="w-3 h-3" /> Live Now
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-[11px] font-bold uppercase mt-1">
                      Scheduled
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded font-bold border border-zinc-700">
                      {item.type}
                    </span>
                    <span className="text-zinc-500 text-[11px] font-semibold">{item.platform}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    {item.creator}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col gap-2">
                  {item.status === "live" ? (
                    <button className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Play className="w-3.5 h-3.5 fill-white" /> Tune In
                    </button>
                  ) : (
                    <button className="bg-zinc-800 text-zinc-200 text-xs font-bold px-4 py-2 rounded-lg hover:bg-zinc-700 border border-zinc-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Bell className="w-3.5 h-3.5" /> Remind Me
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {TV_GUIDE_DATA[selectedDay].length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No independent streams currently scheduled for {selectedDay}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. CATEGORIZED CREATOR ROWS (INCLUDING CREATOR HIGHLIGHTS) */}
      <div className="mt-8">
        {CONTENT_SECTIONS.map((section) => (
          <VideoCarousel key={section.id} section={section} />
        ))}
      </div>

      {/* 4. FEATURED CREATOR SPOTLIGHT BANNER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 my-16">
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/40 border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img src={CREATOR_SPOTLIGHT.avatar} alt={CREATOR_SPOTLIGHT.creatorName} className="w-16 h-16 rounded-full border-2 border-red-500 object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Creator Spotlight of the Week</span>
                </div>
                <h2 className="text-2xl font-black text-white">{CREATOR_SPOTLIGHT.creatorName}</h2>
                <p className="text-xs text-zinc-400">{CREATOR_SPOTLIGHT.platform} • {CREATOR_SPOTLIGHT.subscribers}</p>
              </div>
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2">
              Visit Channel <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-zinc-300 max-w-3xl mb-6 font-medium">{CREATOR_SPOTLIGHT.bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CREATOR_SPOTLIGHT.featuredVideos.map((vid) => (
              <div key={vid.id} className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3 hover:border-zinc-600 transition-colors group cursor-pointer">
                <div className="aspect-video bg-zinc-800 rounded overflow-hidden relative mb-2">
                  <img src={vid.image} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white rounded">
                    {vid.duration}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 group-hover:text-white">{vid.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. AUDIO LOUNGE (INDEPENDENT PODCASTS) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 text-red-500 rounded-lg border border-red-500/30">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">The Audio Lounge</h2>
              <p className="text-sm text-zinc-400">Independent podcasts and fan radio</p>
            </div>
          </div>
          <button className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1">
            View All Audio <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PODCASTS.map((pod) => (
            <div key={pod.id} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-950/50 border border-red-800/40 px-2 py-0.5 rounded">
                    {pod.platform}
                  </span>
                  {pod.isNew && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-400 transition-colors mb-1">{pod.title}</h3>
                <p className="text-xs text-zinc-300 font-medium line-clamp-2 mb-2">{pod.episode}</p>
                <p className="text-[11px] text-zinc-500">{pod.creator}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pod.duration}</span>
                  <span>•</span>
                  <span>{pod.date}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CANADIAN SOCCER CREATOR DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <div className="border-t border-zinc-800 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-white tracking-tight">Creator Directory</h2>
            </div>
            <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              Submit a Channel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DIRECTORY_CREATORS.map((c, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 text-center hover:border-zinc-600 transition-colors group cursor-pointer">
                <img src={c.image} alt={c.name} className="w-14 h-14 rounded-full mx-auto mb-3 object-cover border border-zinc-700 group-hover:border-red-500 transition-colors" />
                <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{c.name}</h4>
                <p className="text-[11px] text-zinc-400 font-medium">{c.category}</p>
                <p className="text-[10px] text-zinc-500 mt-1">{c.platform}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
