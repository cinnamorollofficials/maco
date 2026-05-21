import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";

interface DesktopIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  isEditing?: boolean;
  onOpen?: () => void;
  onSelect?: (multiSelect?: boolean) => void;
  onRename?: (newName: string) => void;
  onStartEdit?: () => void;
  onDragEnd?: (point: { x: number; y: number }) => void;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  id,
  icon, 
  label, 
  isSelected, 
  isEditing,
  onOpen, 
  onSelect,
  onRename,
  onStartEdit,
  onDragEnd,
  dragConstraints
}) => {
  const [tempName, setTempName] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  // For mobile double-tap detection
  const lastTapRef = useRef<number>(0);
  const isTouchDevice = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (tempName.trim()) {
      onRename?.(tempName);
    } else {
      setTempName(label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setTempName(label);
      onRename?.(label);
    }
  };

  // Mobile: detect double-tap to open (since onDoubleClick is unreliable on touch)
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      onOpen?.();
    } else {
      onSelect?.();
    }
    lastTapRef.current = now;
  }, [onOpen, onSelect]);

  return (
    <motion.div
      id={`icon-${id}`}
      drag
      dragMomentum={false}
      dragConstraints={dragConstraints}
      // On touch devices, require a longer press before drag starts
      // so that quick taps are not swallowed by the drag gesture recognizer
      dragListener={!isTouchDevice.current}
      whileDrag={{ zIndex: 10000 }}
      onDragEnd={(_, info) => onDragEnd?.(info.point)}
      onDoubleClick={onOpen}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect?.(e.shiftKey);
      }}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => e.stopPropagation()}
      className={`desktop-icon w-[100px] flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-default select-none group relative transition-colors pointer-events-auto ${isSelected ? 'bg-blue-500/30' : 'hover:bg-white/10'}`}
    >
      <div className="w-16 h-16 flex items-center justify-center relative pointer-events-none">
        <div className="w-14 h-14 drop-shadow-lg group-active:scale-95 transition-transform flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      {isEditing ? (
        <input
          ref={inputRef}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="bg-blue-600 text-white text-[12px] px-1 rounded-sm outline-none w-full text-center"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span 
          className={`text-[12px] text-white text-center leading-tight px-1.5 py-0.5 rounded-sm drop-shadow-md line-clamp-2 max-w-full ${isSelected ? 'bg-blue-600' : ''}`}
          onClick={(e) => {
            if (isSelected) {
              e.stopPropagation();
              onStartEdit?.();
            }
          }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
};

export default DesktopIcon;
