import { 
  ChevronLeft, 
  ChevronRight, 
  Sidebar as SidebarIcon, 
  LayoutGrid, 
  Share, 
  Folder,
  Trash2
} from "lucide-react";
import { motion } from "motion/react";

interface FinderContentProps {
  onOpenApp: (appId: string, options?: any) => void;
  initialPath?: string;
  files: Record<string, any[]>;
  onMoveToTrash: (file: any, path: string, point: { x: number; y: number }) => void;
  isFocused?: boolean;
  trashItems?: any[];
  onEmptyTrash?: () => void;
  onPutBack?: (item: any) => void;
}

const FinderContent: React.FC<FinderContentProps> = ({ 
  onOpenApp, 
  initialPath, 
  files, 
  onMoveToTrash,
  isFocused,
  trashItems = [],
  onEmptyTrash,
  onPutBack
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath || "Recents");
  const [history, setHistory] = useState<string[]>([initialPath || "Recents"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isTrash = currentPath === 'Trash';
  const items = isTrash ? trashItems : (files[currentPath] || []);
  
  useEffect(() => {
    if (initialPath) {
      setCurrentPath(initialPath);
      setHistory([initialPath]);
      setHistoryIndex(0);
    }
  }, [initialPath]);

  useEffect(() => {
    if (isFocused) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          
          if (items.length === 0) return;

          const container = containerRef.current;
          if (!container) return;
          
          const columnWidth = 110 + 24; // minmax(110px) + gap-6
          const columns = Math.max(1, Math.floor(container.clientWidth / columnWidth));
          
          setSelectedId(prev => {
            const currentIndex = items.findIndex(f => (f.id || f.name) === prev);
            
            if (currentIndex === -1) {
              return items[0].id || items[0].name;
            }

            let nextIndex = currentIndex;
            
            if (e.key === 'ArrowDown') nextIndex = currentIndex + columns;
            else if (e.key === 'ArrowUp') nextIndex = currentIndex - columns;
            else if (e.key === 'ArrowRight') nextIndex = currentIndex + 1;
            else if (e.key === 'ArrowLeft') nextIndex = currentIndex - 1;
            
            if (nextIndex < 0) nextIndex = currentIndex;
            if (nextIndex >= items.length) nextIndex = items.length - 1;
            if (nextIndex < 0) nextIndex = 0;
            
            const nextItem = items[nextIndex];
            return nextItem ? (nextItem.id || nextItem.name) : null;
          });
        }

        if (e.key === 'Enter' && selectedId) {
          const selectedItem = items.find(f => (f.id || f.name) === selectedId);
          if (selectedItem) {
            if (selectedItem.type === 'folder' && !isTrash) {
               const targetPath = files[`${currentPath}/${selectedItem.name}`] ? `${currentPath}/${selectedItem.name}` : 
                                 files[selectedItem.name] ? selectedItem.name : null;
              if (targetPath) navigateTo(targetPath);
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFocused, items, selectedId, currentPath, files, isTrash]);

  const navigateTo = (path: string) => {
    if (path === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedId(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedId(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedId(null);
    }
  };

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
            {isTrash ? "Trash" : currentPath.split('/').pop()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isTrash && (
            <button 
              onClick={onEmptyTrash}
              disabled={items.length === 0}
              className="text-[12px] bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1 rounded-md transition-colors disabled:opacity-30 mr-2"
            >
              Empty
            </button>
          )}
          <div className="flex items-center bg-black/20 rounded-md p-0.5 border border-white/5">
            <button className="p-1 px-2 hover:bg-white/10 rounded text-white/80 bg-white/5"><SidebarIcon size={14} /></button>
          </div>
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1 border border-white/5">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><LayoutGrid size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Share size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[180px] bg-[#222222]/50 border-r border-white/5 p-3 flex flex-col justify-between">
          <div className="space-y-4">
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
            <div className="space-y-1">
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
          </div>

          <div className="space-y-1 border-t border-white/5 pt-3">
            <div 
              onClick={() => navigateTo('Trash')}
              className={`px-2.5 py-1.5 rounded-lg text-[13px] cursor-default transition-all flex items-center gap-2 ${currentPath === 'Trash' ? 'bg-blue-600/90 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <Trash2 size={14} className={currentPath === 'Trash' ? 'text-white' : 'text-white/40'} />
              <span>Trash</span>
            </div>
          </div>
        </aside>

        <section 
          ref={containerRef}
          className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 content-start overflow-auto bg-[#1a1a1a]/40"
        >
          {items.map(file => {
            const isSelected = selectedId === (file.id || file.name);
            return (
              <div 
                key={file.id || file.name} 
                className="flex flex-col items-center gap-2 group"
              >
                <div 
                  onClick={() => setSelectedId(file.id || file.name)}
                  onDoubleClick={() => {
                  if (isTrash) return;
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
                    const fileName = (file.name || file.label || "").toLowerCase();
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
                className={`flex flex-col items-center gap-2 group cursor-default p-2 rounded-xl transition-all relative ${isSelected ? 'bg-blue-600/30 ring-1 ring-blue-500/50' : 'hover:bg-white/5'} ${isTrash ? 'opacity-60 grayscale-[30%]' : ''}`}
              >
                <motion.div 
                  drag={!isTrash}
                  dragMomentum={false}
                  onDragEnd={(_, info) => !isTrash && onMoveToTrash(file, currentPath, info.point)}
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
                <span className="text-[12px] text-white/90 text-center line-clamp-2 px-1 font-medium">{file.name || file.label}</span>
              </div>
              
              {isTrash && isSelected && onPutBack && (
                <button 
                  onClick={() => onPutBack(file)}
                  className="mt-1 text-[10px] bg-blue-600/80 hover:bg-blue-600 text-white px-2 py-0.5 rounded transition-all shadow-sm"
                >
                  Put Back
                </button>
              )}
            </div>
          )})}

          {items.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-white/30 space-y-2 mt-20">
              <img 
                src={isTrash ? "/trash_icon.png" : "/folder-icon-macos.png"} 
                className="w-16 h-16 object-contain opacity-20" 
                alt="empty" 
              />
              <span className="text-sm font-medium tracking-wide">
                {isTrash ? "Trash is Empty" : "No items found"}
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FinderContent;
