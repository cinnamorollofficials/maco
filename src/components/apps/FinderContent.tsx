import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sidebar, 
  LayoutGrid, 
  Share, 
  Folder 
} from "lucide-react";
import { motion } from "motion/react";

interface FinderContentProps {
  onOpenApp: (appId: string, options?: any) => void;
  initialPath?: string;
  files: Record<string, any[]>;
  onMoveToTrash: (file: any, path: string, point: { x: number; y: number }) => void;
}

const FinderContent: React.FC<FinderContentProps> = ({ 
  onOpenApp, 
  initialPath, 
  files, 
  onMoveToTrash 
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath || "Recents");
  const [history, setHistory] = useState<string[]>([initialPath || "Recents"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (initialPath) {
      setCurrentPath(initialPath);
      setHistory([initialPath]);
      setHistoryIndex(0);
    }
  }, [initialPath]);

  const navigateTo = (path: string) => {
    if (path === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const items = files[currentPath] || [];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="h-12 bg-[#323232] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={goBack}
              disabled={historyIndex === 0}
              className={`p-1 rounded transition-colors ${historyIndex === 0 ? 'text-white/20' : 'text-white/80 hover:bg-white/10'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className={`p-1 rounded transition-colors ${historyIndex === history.length - 1 ? 'text-white/20' : 'text-white/80 hover:bg-white/10'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="text-white/90 text-sm font-semibold tracking-wide ml-2">
            {currentPath.split('/').pop()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-black/20 rounded-md p-0.5 border border-white/5">
            <button className="p-1 px-2 hover:bg-white/10 rounded text-white/80 bg-white/5"><Sidebar size={14} /></button>
          </div>
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1 border border-white/5">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><LayoutGrid size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Share size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[180px] bg-[#222222]/50 border-r border-white/5 p-3 space-y-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-white/30 uppercase px-2 mb-1.5 tracking-wider">Favorites</div>
            {["Recents", "Applications", "Documents", "Downloads"].map(item => (
              <div 
                key={item} 
                onClick={() => navigateTo(item)}
                className={`px-2.5 py-1.5 rounded-lg text-[13px] cursor-default transition-all ${currentPath.startsWith(item) ? 'bg-blue-600/90 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-white/30 uppercase px-2 mb-1.5 tracking-wider">iCloud</div>
            {["iCloud Drive"].map(item => (
              <div 
                key={item} 
                onClick={() => navigateTo(item)}
                className={`px-2.5 py-1.5 rounded-lg text-[13px] cursor-default transition-all ${currentPath === item ? 'bg-blue-600/90 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 content-start overflow-auto bg-[#1a1a1a]/40">
          {items.map(file => (
            <div 
              key={file.id || file.name} 
              onDoubleClick={() => {
                if (file.type === 'folder') {
                  const targetPath = files[`${currentPath}/${file.name}`] ? `${currentPath}/${file.name}` : 
                                     files[file.name] ? file.name : null;
                  
                  if (targetPath) navigateTo(targetPath);
                  else if (file.name === "Work Projects") navigateTo("Documents/Work Projects");
                  else if (file.name === "Personal") navigateTo("Documents/Personal");
                  else if (file.name === "Alpha_Release") navigateTo("Documents/Work Projects/Alpha_Release");
                  else if (file.name === "Holiday_Photos") navigateTo("Documents/Personal/Holiday_Photos");
                  else if (file.name === "Shared Documents") navigateTo("iCloud Drive/Shared Documents");
                } else {
                  const fileName = file.name.toLowerCase();
                  if (fileName.endsWith('.pdf')) {
                    onOpenApp('preview');
                  } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                    onOpenApp('image_preview');
                  } else if (fileName === 'safari.app') {
                    onOpenApp('chrome');
                  } else if (fileName === 'music.app') {
                    onOpenApp('music');
                  } else if (fileName === 'terminal.app') {
                    onOpenApp('terminal');
                  } else if (fileName === 'messages.app') {
                    onOpenApp('messages');
                  }
                }
              }}
              className="flex flex-col items-center gap-2 group cursor-default p-2 rounded-xl transition-all hover:bg-white/5 relative"
            >
              <motion.div 
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => onMoveToTrash(file, currentPath, info.point)}
                className="w-16 h-16 flex items-center justify-center transition-transform group-active:scale-95 z-20"
              >
                {file.type === 'folder' ? (
                  <img src="/folder-icon-macos.png" className="w-12 h-12 object-contain" alt="folder" />
                ) : (
                  <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 shadow-sm transition-colors">
                    {file.icon}
                  </div>
                )}
              </motion.div>
              <span className="text-[12px] text-white/90 text-center line-clamp-2 px-1 font-medium">{file.name}</span>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-white/30 space-y-2">
              <img src="/folder-icon-macos.png" className="w-16 h-16 object-contain opacity-20" alt="empty" />
              <span className="text-sm font-medium tracking-wide">No items found</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FinderContent;
