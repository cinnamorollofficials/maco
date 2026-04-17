import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  apps: any[];
  onOpenApp: (appId: string) => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose, apps, onOpenApp }) => {
  const displayApps = apps.filter(app => !app.hidden);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[4000] bg-[#1a1a1a]/40 backdrop-blur-[60px] flex flex-col items-center justify-start pt-20"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-full max-w-6xl px-10"
          >
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-8 gap-y-12">
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
                  className="flex flex-col items-center gap-3 group cursor-default"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                    <div className="w-full h-full [&_img]:w-full [&_img]:h-full [&_svg]:w-14 [&_svg]:h-14">
                      {app.icon}
                    </div>
                  </div>
                  <span className="text-white text-[14px] font-medium tracking-wide drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                    {app.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search bar decoration (non-functional, for aesthetics) */}
          <div className="absolute top-10 w-[300px] h-8 bg-white/10 rounded-lg flex items-center px-3 gap-2 border border-white/10">
            <div className="w-3 h-3 border-2 border-white/20 rounded-full" />
            <span className="text-white/20 text-xs">Search</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Launchpad;
