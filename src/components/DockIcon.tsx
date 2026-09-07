import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useTransform, useSpring, MotionValue, useMotionValue } from "motion/react";

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
  mouseX?: MotionValue<number>;
}

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(({ app, onClick, isOpen, isMinimized, isLaunching, mouseX }, forwardedRef) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Combine forwardedRef with local ref for DOM access
  const setRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const defaultMouseX = useMotionValue(Infinity);
  const activeMouseX = mouseX || defaultMouseX;

  // Calculate horizontal distance from cursor to icon center
  const distance = useTransform(activeMouseX, (val: number) => {
    const bounds = rootRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Smooth GPU scale transform (1.0 resting to 1.38 peak) - does NOT trigger layout shifts
  const scaleSync = useTransform(distance, [-120, 0, 120], [1, 1.38, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 260, damping: 18 });

  // Lift icon upward out of dock as it magnifies
  const yOffsetSync = useTransform(distance, [-120, 0, 120], [0, -10, 0]);
  const yOffset = useSpring(yOffsetSync, { mass: 0.1, stiffness: 260, damping: 18 });

  return (
    <div ref={setRef} className="relative group w-12 h-12 flex flex-col items-center justify-end shrink-0">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute -top-11 flex flex-col items-center z-50 pointer-events-none select-none"
          >
            <div className="px-3 py-1 bg-[#1e1e20]/90 backdrop-blur-xl border border-white/15 rounded-md text-white text-[12px] font-medium tracking-tight whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
              {app.title}
            </div>
            <div className="w-2.5 h-1 overflow-hidden -mt-[0.5px]">
              <div className="w-2 h-2 bg-[#1e1e20]/90 rotate-45 transform origin-top-left translate-x-[3.5px] border-r border-b border-white/15" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{
          scale,
          y: isLaunching ? undefined : yOffset,
          transformOrigin: "bottom center",
        }}
        animate={isLaunching ? {
          y: [0, -18, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: [0.4, 0, 0.2, 1],
          }
        } : undefined}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-12 h-12 bg-transparent flex items-center justify-center cursor-default ${isMinimized ? "opacity-70 scale-90" : ""}`}
      >
        <div className="w-full h-full flex items-center justify-center pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          {app.icon}
        </div>
      </motion.div>

      {/* Activation Indicator Dot - Tahoe Style */}
      {isOpen && (
        <div className="absolute -bottom-1.5 flex items-center justify-center w-full pointer-events-none">
          <motion.div
            layoutId={`indicator-${app.id}`}
            className="w-[4.5px] h-[4.5px] bg-white/95 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9),0_0_2px_rgba(255,255,255,1)]"
          />
        </div>
      )}
    </div>
  );
});

DockIcon.displayName = "DockIcon";

export default DockIcon;
