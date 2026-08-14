import React from "react";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface TrashContentProps {
  items: any[];
  onEmptyTrash: () => void;
  onPutBack: (item: any) => void;
}

const TrashContent: React.FC<TrashContentProps> = ({ items, onEmptyTrash, onPutBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Header / Toolbar */}
      <div className="h-12 bg-[#323232] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Trash2 size={18} className="text-white/40" />
          <span className="text-white/90 text-sm font-semibold tracking-wide">Trash</span>
          <span className="text-white/30 text-[12px] ml-1">{items.length} items</span>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button 
              onClick={onEmptyTrash}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-400 px-3 py-1.5 rounded-md transition-all text-[12px] font-medium border border-white/5 hover:border-red-500/30"
            >
              <XCircle size={14} />
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto p-6 bg-[#1a1a1a]/40">
        {items.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 content-start">
            {items.map((item) => (
              <div 
                key={item.id || item.name} 
                className="flex flex-col items-center gap-2 group p-2 rounded-xl transition-all relative hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                {/* Restore Overlay (Shown on Hover) */}
                <button 
                  onClick={() => onPutBack(item)}
                  className="absolute top-1 right-1 z-30 opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                  title="Put Back"
                >
                  <RotateCcw size={12} />
                </button>

                <div className="w-16 h-16 flex items-center justify-center opacity-60 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                  {item.type === 'folder' ? (
                    <img src="/folder-icon-macos.webp" className="w-12 h-12 object-contain" alt="folder" />
                  ) : (
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                  )}
                </div>
                
                <span className="text-[12px] text-white/70 text-center line-clamp-2 px-1 font-medium group-hover:text-white transition-colors">
                  {item.name || item.label}
                </span>

                <div className="text-[10px] text-white/20 font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                  Deleted
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
              <Trash2 size={48} className="opacity-10" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white/40">Trash is Empty</h3>
              <p className="text-sm text-white/20">Items you delete will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashContent;
