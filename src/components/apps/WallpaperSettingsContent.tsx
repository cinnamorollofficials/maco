import React, { useState } from "react";
import { Globe } from "lucide-react";
import { WALLPAPER_PRESETS, GRADIENTS } from "../../constants";

interface WallpaperSettingsContentProps {
  current: string;
  onSelect: (url: string) => void;
}

const WallpaperSettingsContent: React.FC<WallpaperSettingsContentProps> = ({ current, onSelect }) => {
  const [customUrl, setCustomUrl] = useState("");

  return (
    <div className="p-8 h-full bg-[#f6f6f6] overflow-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Desktop Wallpaper</h2>
      
      <div className="mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Custom Image URL</h3>
        <div className="flex gap-3">
          <input 
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste unsplash or image link..."
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20"
          />
          <button 
            onClick={() => onSelect(customUrl)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Photography</h3>
          <div className="grid grid-cols-2 gap-4">
            {WALLPAPER_PRESETS.map(wp => (
              <div 
                key={wp.url}
                onClick={() => onSelect(wp.url)}
                className={`relative group cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${current === wp.url ? 'border-blue-500' : 'border-transparent'}`}
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
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Gradients</h3>
          <div className="grid grid-cols-2 gap-4">
            {GRADIENTS.map(g => (
              <div 
                key={g.value}
                onClick={() => onSelect(g.value)}
                className={`h-32 rounded-xl cursor-pointer border-2 transition-all relative group items-center justify-center flex ${current === g.value ? 'border-blue-500' : 'border-transparent'}`}
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
