import React from "react";
import { RotateCw, Crop, Pencil, Share } from "lucide-react";

const ImagePreviewContent = () => {
  return (
    <div className="flex flex-col h-full bg-[#333333]">
      <div className="h-10 bg-[#444444] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><RotateCw size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Crop size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Pencil size={14} /></button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/80"><Share size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-0 flex justify-center items-center bg-[#1a1a1a]">
        <img 
          src="https://picsum.photos/seed/macos/1920/1080" 
          alt="Preview" 
          className="max-w-[90%] max-h-[90%] object-contain shadow-2xl rounded-sm"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default ImagePreviewContent;
