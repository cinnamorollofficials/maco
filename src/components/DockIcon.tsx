import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AppInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  color?: string;
}

interface DockIconProps {
  app: AppInfo;
  onClick: () => void;
  isOpen?: boolean;
  isMinimized?: boolean;
  isLaunching?: boolean;
}

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(({ app, onClick, isOpen, isMinimized, isLaunching }, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick();
  };

  // FIX: Defined a proper "initial" variant so Framer Motion knows the resting state.
  // FIX: "launch" now uses repeatType: "loop" with a proper easing so the bounce
  //      cycles seamlessly without jumping or getting stuck between iterations.
  const animationVariants = {
    initial: {
      scale: 1,
      y: 0,
    },
    launch: {
      y: [0, -18, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      scale: 1.2,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative group flex flex-col items-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-12 px-3 py-1 bg-[#1d1d1f]/80 backdrop-blur-xl border border-white/10 rounded-lg text-white text-[12px] font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none"
          >
            {app.title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        variants={animationVariants}
        // FIX: Framer Motion controls scale/y — removed `transition-all` from className
        //      to prevent CSS transitions from conflicting with Framer Motion animations.
        animate={isLaunching ? "launch" : isHovered ? "hover" : "initial"}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-10 h-10 md:w-14 md:h-14 bg-transparent flex items-center justify-center cursor-default ${isMinimized ? "opacity-70 scale-90" : ""}`}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
          {app.icon}
        </div>
      </motion.div>

      {/* Activation Indicator Dot - Tahoe Style */}
      {isOpen && (
        <motion.div
          layoutId={`indicator-${app.id}`}
          className="absolute -bottom-1.5 w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,1)]"
        />
      )}
    </div>
  );
});

DockIcon.displayName = "DockIcon";

export default DockIcon;
