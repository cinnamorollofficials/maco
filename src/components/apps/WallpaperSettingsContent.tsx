import React, { useState } from "react";
import { WALLPAPER_PRESETS, GRADIENTS } from "../../constants";

interface WallpaperSettingsContentProps {
  current: string;
  onSelect: (url: string) => void;
}

const WallpaperSettingsContent: React.FC<WallpaperSettingsContentProps> = ({ current, onSelect }) => {
  const [customUrl, setCustomUrl] = useState("");

  return (
    <div className="p-8 h-full bg-[#1e1e1e] overflow-auto no-scrollbar">
      <h2 className="text-2xl font-bold mb-8 text-white/90">Desktop Wallpaper</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-[11px] font-bold text-white/30 uppercase mb-4 tracking-[0.05em]">Photography</h3>
          <div className="grid grid-cols-2 gap-4">
            {WALLPAPER_PRESETS.map(wp => (
              <div 
                key={wp.url}
                onClick={() => onSelect(wp.url)}
                className={`relative group cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${current === wp.url ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-white/5 hover:border-white/20'}`}
              >
                <img src={wp.url} alt={wp.name} className="w-full h-32 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                  <span className="text-[11px] font-bold text-white">{wp.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-white/30 uppercase mb-4 tracking-[0.05em]">Gradients</h3>
          <div className="grid grid-cols-2 gap-4">
            {GRADIENTS.map(g => (
              <div 
                key={g.value}
                onClick={() => onSelect(g.value)}
                className={`h-32 rounded-xl cursor-pointer border-2 transition-all relative group items-center justify-center flex ${current === g.value ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-white/5 hover:border-white/20'}`}
                style={{ background: g.value }}
              >
                <span className="text-[11px] font-bold text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperSettingsContent;
