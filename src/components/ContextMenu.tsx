import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreateFolder: () => void;
  onChangeWallpaper: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onCreateFolder, onChangeWallpaper }) => {
  return (
    <div 
      className="fixed z-[6000] bg-[#1d1d1f]/70 backdrop-blur-2xl border border-white/20 rounded-xl py-1.5 w-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[13px] text-white overflow-hidden"
      style={{ left: x, top: y }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors"
        onClick={onCreateFolder}
      >
        New Folder
      </div>
      <div className="h-px bg-white/10 my-1 mx-4" />
      <div className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors">Get Info</div>
      <div 
        className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors"
        onClick={onChangeWallpaper}
      >
        Change Desktop Background...
      </div>
      <div className="h-px bg-white/10 my-1 mx-4" />
      <div className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors">Use Stacks</div>
      <div className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors">Sort By</div>
      <div className="px-3 py-1.5 hover:bg-blue-600 cursor-default rounded-md mx-1.5 transition-colors">Clean Up</div>
    </div>
  );
};

export default ContextMenu;
