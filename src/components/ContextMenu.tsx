import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onCreateFolder: () => void;
  onChangeWallpaper: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onCreateFolder, onChangeWallpaper }) => {
  return (
    <div 
      className="fixed z-[3000] bg-white/70 backdrop-blur-2xl border border-white/30 rounded-lg py-1 w-56 shadow-2xl text-[13px] text-gray-900 overflow-hidden"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors"
        onClick={onCreateFolder}
      >
        New Folder
      </div>
      <div className="h-px bg-gray-900/10 my-1 mx-3" />
      <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors">Get Info</div>
      <div 
        className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors"
        onClick={onChangeWallpaper}
      >
        Change Desktop Background...
      </div>
      <div className="h-px bg-gray-900/10 my-1 mx-3" />
      <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors">Use Stacks</div>
      <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors">Sort By</div>
      <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-default rounded-md mx-1 transition-colors">Clean Up</div>
    </div>
  );
};

export default ContextMenu;
