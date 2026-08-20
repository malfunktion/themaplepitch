import React from 'react';

interface VideoItem {
  id: string;
  title: string;
  airDate: string;
  duration: string;
  thumbnailUrl: string;
  matchup?: string;
  alt?: string;
}

interface ProvincialVideoVaultProps {
  leagueName: string;
  gender: string;
  videos: { upcoming: VideoItem[]; lastWeek: VideoItem[]; popular: VideoItem[] };
}

export default function ProvincialVideoVault({ leagueName, gender, videos }: ProvincialVideoVaultProps) {
  const featured = [...videos.popular, ...videos.lastWeek].slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>{leagueName} &middot; {gender} VIDEO VAULT</span>
        <span className="text-red-600 font-bold">ARCHIVE</span>
      </div>
      <p className="text-xs text-neutral-300">
        Match highlights, tactical breakdowns, and full match replays.
      </p>
      {featured.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featured.map((v) => (
            <div key={v.id} className="flex flex-col gap-1.5">
              <div className="aspect-video bg-border dark:bg-neutral-800 rounded-sm overflow-hidden relative">
                {v.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnailUrl} alt={v.alt || v.title} className="w-full h-full object-cover" />
                )}
                <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 text-white px-1 rounded-sm">{v.duration}</span>
              </div>
              <span className="text-[11px] font-bold text-charcoal dark:text-neutral-200 leading-snug">{v.title}</span>
              {v.matchup && <span className="text-[9px] text-charcoal-soft">{v.matchup}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-charcoal-soft py-2">No video content archived for this league yet.</p>
      )}
    </div>
  );
}
