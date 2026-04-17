import React, { useState, useEffect } from "react";
import { Apple, Wifi, Search, Volume2, Battery } from "lucide-react";

const TopBar = () => {
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
      <div className="flex items-center gap-4">
        <Apple size={14} className="fill-white" />
        <span className="font-bold">Finder</span>
        <span className="opacity-80 font-normal">File</span>
        <span className="opacity-80 font-normal">Edit</span>
        <span className="opacity-80 font-normal">View</span>
        <span className="opacity-80 font-normal">Go</span>
        <span className="opacity-80 font-normal">Window</span>
        <span className="opacity-80 font-normal">Help</span>
      </div>
      <div className="flex items-center gap-4">
        <Wifi size={14} className="opacity-80" />
        <Search size={14} className="opacity-80" />
        <Volume2 size={14} className="opacity-80" />
        <Battery size={16} className="opacity-80" />
        <div className="flex items-center gap-2">
          <span className="opacity-80 font-normal">{time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</span>
          <span className="opacity-80 font-normal">{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
