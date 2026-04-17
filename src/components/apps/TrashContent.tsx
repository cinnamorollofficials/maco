import React from "react";
import { Trash2, Folder } from "lucide-react";

interface TrashContentProps {
  items: any[];
  onEmpty: () => void;
  onPutBack: (item: any) => void;
}

const TrashContent: React.FC<TrashContentProps> = ({ items, onEmpty, onPutBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="h-12 bg-[#323232] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-white/90 text-sm font-semibold ml-2">Trash</div>
          <div className="text-white/40 text-[11px]">{items.length} items</div>
        </div>
        <button 
          onClick={onEmpty}
          disabled={items.length === 0}
          className="text-[12px] bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1 rounded-md transition-colors disabled:opacity-30"
        >
          Empty Trash
        </button>
      </div>

      <div className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 content-start overflow-auto bg-[#1a1a1a]/40">
        {items.map(item => (
          <div 
            key={item.id} 
            className="flex flex-col items-center gap-2 group cursor-default p-2 rounded-xl transition-all hover:bg-white/5"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              {item.type === 'folder' ? (
                <Folder size={40} className="text-blue-400 fill-blue-500/30 opacity-60" />
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center opacity-60">
                  {item.icon}
                </div>
              )}
            </div>
            <span className="text-[11px] text-white/70 text-center line-clamp-2 px-1">{item.label || item.name}</span>
            <button 
              onClick={() => onPutBack(item)}
              className="text-[10px] bg-blue-600/80 hover:bg-blue-600 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Put Back
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full h-full flex flex-col items-center justify-center text-white/20 mt-10">
            <Trash2 size={64} className="opacity-10 mb-2" />
            <span className="text-sm">Trash is Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashContent;
