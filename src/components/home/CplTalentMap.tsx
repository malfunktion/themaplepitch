'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface TalentRegion {
  id: string;
  name: string;
  province: string;
  count: number;
  coordinates: { x: string; y: string }; // percentage for pin placement
  topProspects: string[];
}

const REGIONS: TalentRegion[] = [
  { id: 'bc', name: 'Lower Mainland / Vancouver Island', province: 'BC', count: 42, coordinates: { x: '12%', y: '45%' }, topProspects: ['TSS Rovers Pipeline', 'Surrey Academy Grads', 'Whitecaps Academy'] },
  { id: 'ab', name: 'Calgary & Edmonton Corridor', province: 'AB', count: 28, coordinates: { x: '28%', y: '40%' }, topProspects: ['Cavalry FC U21', 'FC Edmonton Legacy', 'Calgary Foothills'] },
  { id: 'on-gt', name: 'Greater Toronto Area (GTA)', province: 'ON', count: 85, coordinates: { x: '68%', y: '58%' }, topProspects: ['Vaughan Azzurri', 'Scrosoppi FC', 'Simcoe County Rovers', 'North Toronto Nitros'] },
  { id: 'on-sw', name: 'Southwestern Ontario', province: 'ON', count: 34, coordinates: { x: '61%', y: '63%' }, topProspects: ['Guelph United', 'FC London', 'Blue Devils FC'] },
  { id: 'qc', name: 'Greater Montreal & Quebec', province: 'QC', count: 51, coordinates: { x: '78%', y: '52%' }, topProspects: ['CS Saint-Laurent', 'CF Montréal Academy', 'PLSQ Elite'] },
  { id: 'at', name: 'Atlantic Canada', province: 'NS/NB', count: 19, coordinates: { x: '88%', y: '55%' }, topProspects: ['HFX Wanderers U23', 'Suburban FC', 'Codiac Soccer'] },
];

export default function CplTalentMap({ league = 'CPL' }: { league?: 'CPL' | 'NSL' }) {
  const [selectedRegion, setSelectedRegion] = useState<TalentRegion>(REGIONS[2]); // Default GTA
  
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-4 text-charcoal shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-crimson animate-pulse" />
          <h3 className="text-xs font-mono uppercase tracking-widest font-extrabold text-charcoal">
            {league} & CANADIAN TALENT ORIGIN MAP // GRASSROOTS PIPELINE
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-crimson/10 text-crimson px-2 py-0.5 rounded-sm font-bold border border-crimson/20">
          259 ACTIVE PRO-AM ROOTS
        </span>
      </div>

      {/* Map Container & Interactive Pins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Visual Map Representation */}
        <div className="lg:col-span-7 relative bg-card/80 border border-border rounded-sm h-[260px] flex items-center justify-center overflow-hidden p-2">
          {/* Stylized Canada Outline Background Watermark */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute text-[11px] font-mono tracking-widest text-charcoal-soft uppercase select-none">
            [ DOMESTIC SCOUTING GRID // CANADA FOOTBALL TOPOGRAPHY ]
          </div>

          {/* Interactive Pins */}
          {REGIONS.map((region) => {
            const isSelected = selectedRegion.id === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                style={{ left: region.coordinates.x, top: region.coordinates.y }}
                className={`absolute group -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform hover:scale-125 focus:outline-none`}
                title={`${region.name} (${region.count} Prospects)`}
              >
                <span className={`absolute w-6 h-6 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-crimson' : 'bg-card'}`} />
                <span className={`relative w-3 h-3 rounded-full flex items-center justify-center border text-[8px] font-bold ${
                  isSelected ? 'bg-crimson border-white text-white shadow-lg' : 'bg-card border-card text-charcoal'
                }`}>
                  ●
                </span>
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-bg border border-border text-charcoal text-[10px] font-mono px-2 py-1 rounded-sm whitespace-nowrap z-30 shadow-xl">
                  {region.name} • {region.count} Prospects
                </div>
              </button>
            );
          })}
        </div>

        {/* Region Breakdown Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-card/40 border border-border/80 p-3 rounded-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-crimson font-bold uppercase tracking-wider">
                REGION INTEL // {selectedRegion.province}
              </span>
              <span className="text-[10px] font-mono bg-border text-charcoal px-1.5 py-0.5 rounded-sm">
                {selectedRegion.count} Talents Originating
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-charcoal mb-2 leading-snug">
              {selectedRegion.name}
            </h4>
            <p className="text-xs text-charcoal-soft mb-3 leading-relaxed">
              Primary feeder hub accounting for elite pro-am production, academy tier development, and professional scouting metrics.
            </p>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-charcoal-soft uppercase block">Key Hub Academies & Pathways:</span>
              {selectedRegion.topProspects.map((prospect, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-mono text-charcoal bg-card/80 px-2 py-1 rounded-sm border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                  {prospect}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border flex justify-between items-center text-[10px] font-mono text-charcoal-soft">
            <span>CLICK PINS TO SWAP REGION</span>
            <span className="text-crimson font-bold">LIVE TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}