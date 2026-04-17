import React, { useState, useRef, useCallback } from "react";
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
  children
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 80 });
  const [size] = useState({ w: 640, h: 420 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMaximize = () => {
    setIsMaximized(prev => !prev);
    onFocus();
  };

  const handleTitlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isMaximized) return;
    // Don't start drag if clicking a button
    if ((e.target as HTMLElement).closest('button')) return;
    
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onFocus();
  }, [isMaximized, position.x, position.y, onFocus]);

  const handleTitlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const newX = e.clientX - dragOffset.current.x;
    const newY = Math.max(24, e.clientY - dragOffset.current.y); // Don't go above menu bar
    setPosition({ x: newX, y: newY });
  }, []);

  const handleTitlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const windowStyle: React.CSSProperties = isMaximized 
    ? {
        position: 'fixed',
        top: 24,
        left: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        borderRadius: 0,
        zIndex,
        boxSizing: 'border-box'
      }
    : {
        position: 'fixed',
        top: position.y,
        left: position.x,
        right: 'auto',
        bottom: 'auto',
        width: size.w,
        height: size.h,
        borderRadius: 12,
        zIndex,
        boxSizing: 'border-box'
      };

  return (
    <div
      style={windowStyle}
      className="flex flex-col bg-[#1c1c1c]/85 backdrop-blur-[30px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/15 transition-[top,left,right,bottom,width,height,border-radius] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      <div 
        className={`h-[38px] flex items-center justify-between px-4 grow-0 shrink-0 bg-white/5 border-b border-white/5 ${!isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
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
            onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 flex items-center justify-center transition-colors hover:bg-[#27c93f]/80"
          >
            <Maximize2 size={8} className="text-black/60 opacity-0 group-hover/traffic:opacity-100" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 [&_img]:w-full [&_img]:h-full [&_svg]:w-3.5 [&_svg]:h-3.5 text-white/60">
              {app.icon}
            </div>
            <span className="text-white/90 text-[13px] font-semibold tracking-tight">{app.title}</span>
          </div>
        </div>
        
        <div className="w-[60px]" />
      </div>

      <div className="flex-1 overflow-hidden pointer-events-auto bg-[#1a1a1a]/40">
        {children}
      </div>
    </div>
  );
};

export default Window;
