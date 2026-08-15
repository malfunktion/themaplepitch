'use client';

import React from 'react';
import Image from 'next/image';

export default function SidebarAdWidget4() {
  return (
    <div className="bg-card border border-border rounded-sm p-3 text-charcoal font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
        <span className="text-[10px] tracking-widest font-bold uppercase text-charcoal-soft">
          {' // '} SPONSORED PARTNER
        </span>
        <span className="text-[9px] bg-crimson text-white px-1.5 py-0.5 rounded-sm font-bold tracking-wider">
          AD
        </span>
      </div>
      {/* Ad Image Container - Converted to Next.js Image */}
      {/* We add a specific aspect ratio container here (e.g., h-48) to hold the fill image */}
      <div className="relative w-full h-48 overflow-hidden rounded-sm bg-card border border-border group">
        <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <Image 
             src="/ad4.jpg" 
             alt="Matchday Sponsor Ad"
             fill
             className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
      </div>
    </div>
  );
}
