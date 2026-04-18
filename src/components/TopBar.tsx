import React, { useState, useEffect } from "react";
import { Wifi, Search, Volume2, Battery, Menu } from "lucide-react";

interface TopBarProps {
  activeAppTitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ activeAppTitle = "Finder" }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[24px] bg-black/30 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-3 z-[1000] text-[13px] text-white font-medium select-none"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1">
          <img 
            src="/apple_logo_white.png" 
            className="w-[14px] h-[14px] object-contain ml-1" 
            alt="Apple" 
          />
        </div>
        <span className="font-bold whitespace-nowrap">{activeAppTitle}</span>
        
        {/* Desktop Menu Items - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4">
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">File</span>
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">Edit</span>
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">View</span>
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">Go</span>
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">Window</span>
          <span className="opacity-80 font-normal hover:opacity-100 cursor-default">Help</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-4">
          <Wifi size={14} className="opacity-80" />
          <Search size={14} className="opacity-80" />
        </div>
        <Volume2 size={14} className="opacity-80" />
        <Battery size={16} className="opacity-80" />
        <div className="flex items-center gap-2">
          <span className="hidden lg:block opacity-80 font-normal">{time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</span>
          <span className="opacity-80 font-normal">{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
