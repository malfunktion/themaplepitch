'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageSquare, CheckCircle2, ExternalLink, Camera } from 'lucide-react';

export default function FanHubSection() {
  // Client-side voting state using localStorage (zero server cost)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Lightbox state for the Fan Gallery
  const [activePhoto, setActivePhoto] = useState<{
    url: string;
    username: string;
    caption: string;
    postUrl: string;
    platform: 'X.com' | 'Instagram';
  } | null>(null);

  const poll = {
    question: "Who was the best Canadian Abroad this weekend?",
    options: [
      { id: 1, text: "Jonathan David (Lille)", votes: 642, percentage: 58 },
      { id: 2, text: "Alphonso Davies (Bayern)", votes: 310, percentage: 28 },
      { id: 3, text: "Cyle Larin (Mallorca)", votes: 154, percentage: 14 },
    ]
  };

  // Mock data for the scrollable X feed
  const xPosts = [
    { handle: "@CanadaSoccerEN", time: "2h", text: "Matchday minus 4 days. BC Place is shaping up for a massive test against Mexico. Secure your seats now. 🍁🇨🇦" },
    { handle: "@TheMaplePitch", time: "4h", text: "Jonathan David hits another milestone. Form is temporary, class is permanent. Full breakdown live on the wire." },
    { handle: "@CPLsoccer", time: "6h", text: "The race for the regular season shield is heating up. Check out the latest tactical numbers in the Scout Dash." },
  ];

  // Mock data for the scrollable Instagram feed
  const igPosts = [
    { caption: "Matchday atmosphere loading... 🏟️🇨🇦", likes: "2.4K", time: "3h ago" },
    { caption: "In camp and locked in. #CANMNT", likes: "4.1K", time: "Yesterday" },
    { caption: "Heritage collection on display. Roots run deep.", likes: "1.8K", time: "2d ago" },
  ];

  // Approved fan submissions gallery (8 items for 4x2 grid)
  const fanPhotos = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
      username: "@torontoreds_99",
      caption: "BMO Field looking absolute pristine tonight. Let's get these three points! 🔴⚪",
      postUrl: "https://instagram.com",
      platform: "Instagram" as const,
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
      username: "@voyagers_north",
      caption: "Tailgate setup is officially underway in Vancouver. #CANMNT",
      postUrl: "https://twitter.com",
      platform: "X.com" as const,
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
      username: "@cpl_fanatic",
      caption: "Tim Hortons Field rocking for the derby matchday. ⚽🔨",
      postUrl: "https://instagram.com",
      platform: "Instagram" as const,
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop",
      username: "@maple_pitch_diehard",
      caption: "New jersey crest looking sharp in person. Roots run deep.",
      postUrl: "https://twitter.com",
      platform: "X.com" as const,
    },
    {
      id: 5,
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
      username: "@van_caps_99",
      caption: "Matchday mood under the lights.",
      postUrl: "https://instagram.com",
      platform: "Instagram" as const,
    },
    {
      id: 6,
      thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1200&auto=format&fit=crop",
      username: "@prairie_footy",
      caption: "Grassroots game strong across the provinces.",
      postUrl: "https://twitter.com",
      platform: "X.com" as const,
    },
    {
      id: 7,
      thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
      username: "@atlantic_reds",
      caption: "Watching the match from Halifax!",
      postUrl: "https://instagram.com",
      platform: "Instagram" as const,
    },
    {
      id: 8,
      thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
      username: "@montreal_foot",
      caption: "Allez Les Rouges!",
      postUrl: "https://twitter.com",
      platform: "X.com" as const,
    }
  ];

  useEffect(() => {
    const savedVote = localStorage.getItem('maple_pitch_fan_vote');
    if (savedVote) {
      setSelectedOption(Number(savedVote));
      setHasVoted(true);
    }
  }, []);

  const handleVote = (id: number) => {
    if (hasVoted) return;
    setSelectedOption(id);
    setHasVoted(true);
    localStorage.setItem('maple_pitch_fan_vote', id.toString());
  };

  return (
    <div className="bg-card border border-border rounded-sm p-4 text-charcoal dark:text-neutral-200 font-sans flex flex-col gap-4 w-full h-full relative shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>
          <h2 className="text-xs font-bold tracking-widest text-charcoal dark:text-white uppercase">
            FAN HUB // COMMUNITY COMMAND
          </h2>
        </div>
        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">CLIENT-SIDE ACTIVE</span>
      </div>

      {/* 6-Column Precise Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        
        {/* Columns 1 & 2 (Row 1): Weekly Fan Vote */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-border dark:border-border/60 pb-1">
              <span className="text-[10px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1">
                Weekly Fan Vote
              </span>
              <span className="text-[9px] text-charcoal-soft font-mono">1,106 VOTES</span>
            </div>
            <p className="text-[11px] font-medium text-charcoal dark:text-white leading-tight">
              {poll.question}
            </p>
            <div className="flex flex-col gap-1.5 mt-0.5">
              {poll.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={hasVoted}
                  className={`w-full text-left px-2 py-1 rounded-sm text-[10px] transition-colors border relative overflow-hidden flex flex-col gap-0.5 ${
                    selectedOption === opt.id 
                      ? 'border-crimson bg-crimson/10 text-charcoal dark:text-white font-bold' 
                      : 'border-border bg-neutral-100 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-medium truncate">{opt.text}</span>
                    {hasVoted && <span className="font-mono text-crimson dark:text-crimson text-[9px]">{opt.percentage}%</span>}
                  </div>
                  {hasVoted && (
                    <div 
                      className="absolute bottom-0 left-0 top-0 bg-crimson/20 z-0 transition-all duration-500" 
                      style={{ width: `${opt.percentage}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-neutral-500 font-mono pt-1.5 border-t border-border dark:border-border/50 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-crimson dark:text-crimson" /> Secured via LocalStorage
          </div>
        </div>

        {/* Columns 3 & 4 (Row 1): X.com Feed */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-border dark:border-border/60 pb-1">
            <span className="text-[9px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1.5">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X.com Feed
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse"></span>
          </div>
          
          <div className="my-1 max-h-[85px] overflow-y-auto hide-scrollbar flex flex-col gap-2 pr-1">
            {xPosts.slice(0, 2).map((post, idx) => (
              <div key={idx} className="border-b border-border dark:border-border/40 pb-1.5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="font-bold text-charcoal dark:text-white">{post.handle}</span>
                  <span className="text-charcoal-soft font-mono text-[8px]">{post.time}</span>
                </div>
                <p className="text-[10px] text-neutral-600 dark:text-neutral-300 leading-snug mt-0.5 line-clamp-1">
                  {post.text}
                </p>
              </div>
            ))}
          </div>

          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[8px] text-neutral-500 dark:text-neutral-400 font-mono hover:text-crimson dark:hover:text-crimson transition-colors pt-1 border-t border-border dark:border-border/50 flex items-center justify-between"
          >
            <span>LIVE UPDATES</span>
            <span>→</span>
          </a>
        </div>

        {/* Columns 5 & 6 (Row 1): Fan Showcase Gallery (8 Small 1x1 Thumbnails in 4x2 Grid) */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between border-b border-border dark:border-border/60 pb-1">
              <span className="text-[9px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-crimson dark:text-crimson" strokeWidth={1.5} /> Fan Showcase
              </span>
              <span className="text-[8px] font-mono text-charcoal-soft">#MAPLEPITCH</span>
            </div>

            {/* 4x2 Grid of 1x1 Aspect Ratio Thumbnails */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {fanPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  onClick={() => setActivePhoto({
                    url: photo.fullUrl,
                    username: photo.username,
                    caption: photo.caption,
                    postUrl: photo.postUrl,
                    platform: photo.platform,
                  })}
                  className="group relative aspect-square bg-neutral-200 dark:bg-neutral-900 rounded-sm overflow-hidden cursor-pointer border border-border hover:border-crimson transition-colors"
                >
                  <Image
                    src={photo.thumbnail}
                    alt={photo.username}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[6px] font-mono text-white bg-crimson px-0.5 rounded-sm">VIEW</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[8px] font-mono text-neutral-500 dark:text-neutral-400 pt-1 border-t border-border dark:border-border/50 flex items-center justify-between mt-1">
            <span>TAG #MAPLEPITCH</span>
            <span className="text-crimson dark:text-crimson">APPROVED QUEUE</span>
          </div>
        </div>

        {/* Columns 1 & 2 (Row 2): r/CanadaSoccer */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} /> r/CanadaSoccer
              </span>
              <span className="text-[9px] text-charcoal-soft font-mono">▲ 412 UPVOTES</span>
            </div>
            <h3 className="text-xs font-bold text-charcoal dark:text-white hover:text-crimson dark:hover:text-crimson transition-colors cursor-pointer line-clamp-1">
              Tactical Breakdown: How Jesse Marsch’s block neutralized top CONCACAF rivals
            </h3>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-snug line-clamp-2">
              Comprehensive breakdown of defensive positioning, midfield compactness, and vertical transitions during the latest international window...
            </p>
          </div>

          <a 
            href="https://reddit.com/r/CanadaSoccer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pt-1.5 border-t border-border dark:border-border/50 flex items-center justify-between text-[9px] font-bold text-neutral-700 dark:text-neutral-300 hover:text-crimson dark:hover:text-crimson transition-colors"
          >
            <span>JOIN DISCUSSION</span>
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </a>
        </div>

        {/* Columns 3 & 4 (Row 2): Instagram Feed */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-border dark:border-border/60 pb-1">
            <span className="text-[9px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1.5">
              <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              Instagram
            </span>
            <span className="text-[8px] font-mono text-charcoal-soft">MEDIA</span>
          </div>

          <div className="my-1 max-h-[85px] overflow-y-auto hide-scrollbar flex flex-col gap-2 pr-1">
            {igPosts.slice(0, 2).map((post, idx) => (
              <div key={idx} className="border-b border-border dark:border-border/40 pb-1.5 last:border-0 last:pb-0">
                <p className="text-[10px] text-neutral-600 dark:text-neutral-300 leading-snug line-clamp-1">
                  {post.caption}
                </p>
                <div className="flex justify-between items-center text-[8px] text-charcoal-soft font-mono mt-0.5">
                  <span>♥ {post.likes}</span>
                  <span>{post.time}</span>
                </div>
              </div>
            ))}
          </div>

          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[8px] text-neutral-500 dark:text-neutral-400 font-mono hover:text-crimson dark:hover:text-crimson transition-colors pt-1 border-t border-border dark:border-border/50 flex items-center justify-between"
          >
            <span>VIEW GALLERY</span>
            <span>→</span>
          </a>
        </div>

        {/* Columns 5 & 6 (Row 2): Supporter Dispatch */}
        <div className="md:col-span-2 bg-surface border border-border rounded-sm p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-border dark:border-border/60 pb-1">
            <span className="text-[9px] font-bold text-crimson dark:text-crimson tracking-wider uppercase flex items-center gap-1">
              <MessageSquare className="w-3 h-3" strokeWidth={1.5} /> Supporter Dispatch
            </span>
            <span className="text-[8px] font-mono text-charcoal-soft">LIVE</span>
          </div>

          <div className="my-1">
            <span className="text-[10px] font-bold text-charcoal dark:text-white block tracking-tight">SUBMIT YOUR CLUB CREW</span>
            <p className="text-[9px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-2 mt-0.5">
              Showcase your local supporters group on matchdays across the country.
            </p>
          </div>

          <div className="text-[8px] text-crimson dark:text-crimson font-mono flex items-center justify-between pt-1 border-t border-border dark:border-border/50">
            <span>COAST TO COAST</span>
            <span>→ QUEUE</span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {activePhoto && (
        <div className="absolute inset-0 bg-white/95 dark:bg-black/90 backdrop-blur-md z-50 rounded-sm p-4 flex flex-col justify-between animate-fadeIn">
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-crimson dark:text-crimson font-bold uppercase tracking-widest">
                [ {activePhoto.platform} SUBMISSION ]
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{activePhoto.username}</span>
            </div>
            <button 
              onClick={() => setActivePhoto(null)}
              className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 hover:bg-crimson text-charcoal dark:text-white rounded-sm flex items-center justify-center transition-colors font-bold text-xs"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </div>

          {/* Centered Large Image */}
          <div className="my-auto py-2 flex items-center justify-center max-h-[60vh]">
            <Image
              src={activePhoto.url}
              alt={activePhoto.username}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: 'auto', maxHeight: '55vh', maxWidth: '100%' }}
              className="object-contain rounded-sm border border-border shadow-2xl"
            />
          </div>

          {/* Bottom Info Overlay */}
          <div className="bg-surface border border-border p-3 rounded-sm flex items-center justify-between gap-4">
            <p className="text-xs text-charcoal dark:text-neutral-200 line-clamp-2">
              {activePhoto.caption}
            </p>
            <a 
              href={activePhoto.postUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1 bg-crimson hover:bg-crimson text-white text-[10px] font-bold font-mono uppercase px-3 py-1.5 rounded-sm transition-colors"
            >
              <span>Original Post</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
      }