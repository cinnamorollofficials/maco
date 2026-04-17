import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command } from "lucide-react";

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  apps: any[];
  onOpenApp: (appId: string) => void;
}

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, apps, onOpenApp }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredApps = apps.filter(app => 
    !app.hidden && app.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredApps.length));
    }
    if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + filteredApps.length) % Math.max(1, filteredApps.length));
    }
    if (e.key === "Enter" && filteredApps.length > 0) {
      onOpenApp(filteredApps[selectedIndex].id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-start justify-center pt-[15vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[600px] bg-[#1e1e1e]/80 backdrop-blur-[35px] border border-white/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10 gap-3">
              <Search className="text-white/40" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent border-none outline-none text-white text-2xl font-light placeholder:text-white/20"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="bg-white/10 px-2 py-1 rounded text-white/40 text-xs flex items-center gap-1">
                <Command size={10} />
                <span>Space</span>
              </div>
            </div>

            {query.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto p-2">
                <div className="px-3 py-1 text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Applications</div>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app, index) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        onOpenApp(app.id);
                        onClose();
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-default transition-colors ${
                        index === selectedIndex ? "bg-blue-600 text-white" : "hover:bg-white/5 text-white/80"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center [&_img]:w-full [&_img]:h-full [&_svg]:w-5 [&_svg]:h-5">
                        {app.icon}
                      </div>
                      <span className="text-[15px] font-medium">{app.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-white/20">No results found</div>
                )}
              </div>
            )}
            
            <div className="px-4 py-2 border-t border-white/10 bg-black/10 flex items-center justify-between">
               <span className="text-[10px] text-white/40 tracking-tight">Search for apps, files, and more</span>
               <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 opacity-40">
                    <span className="text-[10px] text-white">Esc to cancel</span>
                 </div>
               </div>
            </div>
          </motion.div>
          <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;
