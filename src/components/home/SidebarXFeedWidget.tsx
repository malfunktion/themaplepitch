'use client';

import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface TweetItem {
  id: string;
  author: string;
  handle: string;
  timestamp: string;
  content: string;
  likes: string;
  retweets: string;
  url: string;
}

const TWEETS: TweetItem[] = [
  {
    id: 't-1',
    author: 'Fabrizio Romano',
    handle: '@FabrizioRomano',
    timestamp: '18m',
    content: 'Understand European scouts are tracking multiple Canadian academy prospects ahead of the winter transfer window. High interest in CPL young stars.',
    likes: '4.2K',
    retweets: '812',
    url: '#',
  },
  {
    id: 't-2',
    author: 'Canada Soccer',
    handle: '@CanadaSoccerEN',
    timestamp: '1h',
    content: 'Squad update ahead of upcoming international fixtures. Preparations underway at the National Training Centre in Toronto.',
    likes: '1.8K',
    retweets: '340',
    url: '#',
  },
  {
    id: 't-3',
    author: 'CPL Intelligence',
    handle: '@CPLIntel',
    timestamp: '3h',
    content: 'Tactical breakdown: How Forge FC’s mid-block structure neutralized transition threats in the latest provincial clash.',
    likes: '950',
    retweets: '145',
    url: '#',
  },
  {
    id: 't-4',
    author: 'Opta Analyst',
    handle: '@OptaAnalystCA',
    timestamp: '5h',
    content: 'Most progressive carries in the domestic pro-am pyramid this season. Full data metrics now live on the terminal.',
    likes: '2.1K',
    retweets: '420',
    url: '#',
  },
  {
    id: 't-5',
    author: 'Northern Tribune',
    handle: '@NorthernTribune',
    timestamp: '7h',
    content: 'Expansion updates and infrastructure developments across League1 Ontario and League1 BC clubs.',
    likes: '1.4K',
    retweets: '280',
    url: '#',
  },
  {
    id: 't-6',
    author: 'Soccer Stuff',
    handle: '@soccerstuff',
    timestamp: '7h',
    content: 'Expanjdjdjdkdd nddn djfsion updates and infrastructure developments across League1 Ontario and League1 BC clubs.',
    likes: '1.4K',
    retweets: '280',
    url: '#',
  },
  {
    id: 't-8',
    author: 'Northern Tribune',
    handle: '@NorthernTribune',
    timestamp: '7h',
    content: 'Expansion updates and infrastructure developments across League1 Ontario and League1 BC clubs.',
    likes: '1.4K',
    retweets: '280',
    url: '#',
  },
  {
    id: 't-9',
    author: 'Northern Tribune',
    handle: '@NorthernTribune',
    timestamp: '7h',
    content: 'Expansion updates and infrastructure developments across League1 Ontario and League1 BC clubs.',
    likes: '1.4K',
    retweets: '280',
    url: '#',
  },
  {
    id: 't-10',
    author: 'Northern Tribune',
    handle: '@NorthernTribune',
    timestamp: '7h',
    content: 'Expansion updates and infrastructure developments across League1 Ontario and League1 BC clubs.',
    likes: '1.4K',
    retweets: '280',
    url: '#',
  },
];

export default function SidebarXFeedWidget() {
  return (
    <div className="bg-card border border-border rounded-sm p-3.5 flex flex-col h-full justify-between">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-crimson" />
          <h3 className="text-[11px] font-mono uppercase font-bold tracking-widest text-charcoal dark:text-white">
            X.COM // INDUSTRY WIRE
          </h3>
        </div>
        <span className="text-[9px] font-mono text-crimson bg-crimson/10 px-1.5 py-0.5 rounded-sm font-bold">
          LIVE FEED
        </span>
      </div>

      {/* Scrollable Feed Container - Increased height to match Press Box baseline */}
      <div className="max-h-[612.5px] overflow-y-auto space-y-3 pr-1 scrollbar-none flex-1">
        {TWEETS.map((tweet) => (
          <a
            key={tweet.id}
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded-sm bg-surface border border-border dark:border-border/80 hover:border-crimson/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-bold text-charcoal dark:text-white truncate group-hover:text-crimson transition-colors">
                  {tweet.author}
                </span>
                <span className="text-[10px] font-mono text-charcoal-soft truncate">
                  {tweet.handle}
                </span>
              </div>
              <span className="text-[9px] font-mono text-charcoal-soft shrink-0">
                {tweet.timestamp}
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 dark:text-neutral-300 leading-snug line-clamp-3 mb-2">
              {tweet.content}
            </p>
            <div className="flex items-center justify-between text-[9px] font-mono text-charcoal-soft pt-1 border-t border-border dark:border-border/50">
              <span>💬 {tweet.retweets} &nbsp; 🔄 {tweet.likes}</span>
              <ExternalLink className="w-2.5 h-2.5 text-charcoal-soft group-hover:text-crimson transition-colors" />
            </div>
          </a>
        ))}
      </div>

      {/* Footer Status */}
      <div className="mt-2.5 pt-2 border-t border-border text-center">
        <span className="text-[9px] font-mono text-charcoal-soft tracking-wider">
          CURATED SCOUTING INTEL STREAM
        </span>
      </div>
    </div>
  );
}