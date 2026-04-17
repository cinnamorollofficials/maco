import React, { useState } from "react";
import { motion, useDragControls } from "motion/react";
import { X, Minus, Maximize2 } from "lucide-react";
import { WindowState } from "../types";

interface WindowProps {
  app: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  onFocus: () => void;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ 
  app, 
  onClose, 
  onMinimize, 
  zIndex, 
  onFocus,
  dragConstraints,
  children
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      style={{ 
        zIndex,
        width: isMaximized ? "100%" : "640px",
        height: isMaximized ? "calc(100% - 24px)" : "420px",
        top: isMaximized ? "24px" : "80px",
        left: isMaximized ? "0" : "100px",
      }}
      className={`fixed flex flex-col bg-[#1c1c1c]/85 backdrop-blur-[30px] rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/15 transition-[width,height,top,left,border-radius] duration-500 ease-in-out ${isMaximized ? "rounded-none" : ""}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      <div 
        className="h-[38px] flex items-center justify-between px-4 grow-0 shrink-0 bg-white/5 border-b border-white/5"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2 group/traffic">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 flex items-center justify-center transition-colors hover:bg-[#ff5f56]/80"
          >
            <X size={8} className="text-black/60 opacity-0 group-hover/traffic:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 flex items-center justify-center transition-colors hover:bg-[#ffbd2e]/80"
          >
            <Minus size={8} className="text-black/60 opacity-0 group-hover/traffic:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 flex items-center justify-center transition-colors hover:bg-[#27c93f]/80"
          >
            <Maximize2 size={8} className="text-black/60 opacity-0 group-hover/traffic:opacity-100" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-white/40">{app.icon}</span>
            <span className="text-white/90 text-[13px] font-semibold tracking-tight">{app.title}</span>
          </div>
        </div>
        
        <div className="w-[60px]" />
      </div>

      <div className="flex-1 overflow-hidden pointer-events-auto bg-[#1a1a1a]/40">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
