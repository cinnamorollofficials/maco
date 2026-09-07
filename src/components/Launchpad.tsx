import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  apps: any[];
  onOpenApp: (appId: string) => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose, apps, onOpenApp }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const displayApps = apps.filter(app => 
    !app.hidden && app.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[4000] bg-[#1a1a1a]/40 backdrop-blur-[60px] flex flex-col items-center justify-start pt-24"
          onClick={onClose}
        >
          {/* Interactive Search Bar */}
          <div 
            className="absolute top-8 w-[320px] h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center px-3 gap-2.5 border border-white/15 focus-within:border-white/30 focus-within:bg-white/15 transition-all shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Search size={14} className="text-white/50 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          <motion.div 
            initial={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-full max-w-6xl px-10"
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
              {displayApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenApp(app.id);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 md:gap-3 group cursor-default"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                    <div className="w-full h-full [&_img]:w-full [&_img]:h-full [&_svg]:w-10 sm:[&_svg]:w-14">
                      {app.icon}
                    </div>
                  </div>
                  <span className="text-white text-[12px] md:text-[14px] font-medium tracking-wide drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity text-center line-clamp-1 px-1">
                    {app.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {displayApps.length === 0 && (
              <div className="text-center text-white/30 text-base mt-16">
                No apps found for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Launchpad;
