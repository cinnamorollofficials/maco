import React, { useState, useRef, useEffect } from "react";
import { 
  Apple, 
  Search, 
  Wifi, 
  Battery, 
  Moon, 
  Volume2, 
  Monitor, 
  Folder, 
  Settings, 
  Mail, 
  Chrome, 
  MessageSquare, 
  Music, 
  Image as ImageIcon,
  Trash2,
  X,
  Minus,
  Maximize2,
  Clock,
  Terminal,
  FileText,
  LayoutGrid,
  Eye,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Share,
  ChevronLeft,
  ChevronRight,
  Sidebar,
  Crop,
  Pencil,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "motion/react";

// --- Types ---
interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  content: React.ReactNode;
}

interface DesktopItem {
  id: string;
  type: 'folder' | 'file';
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

// --- Constants ---
const WALLPAPERS = [
  { name: "Dynamic Bloom", url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" },
  { name: "Ventura Peak", url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=2070&auto=format&fit=crop" },
  { name: "Deep Ocean", url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop" },
  { name: "Midnight City", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2070&auto=format&fit=crop" },
  { name: "Autumn Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop" },
];

const INITIAL_MOCK_FILES: Record<string, any[]> = {
  "Recents": [
    { id: "f-1", name: "Presentation.pptx", type: "file", icon: <FileText className="text-orange-400" /> },
    { id: "f-2", name: "Invoice_04.pdf", type: "file", icon: <FileText className="text-red-400" /> },
    { id: "f-3", name: "Screenshot.png", type: "file", icon: <ImageIcon className="text-blue-400" /> },
  ],
  "Applications": [
    { id: "a-1", name: "Safari.app", type: "file", icon: <Chrome className="text-blue-400" /> },
    { id: "a-2", name: "Music.app", type: "file", icon: <Music className="text-pink-500" /> },
    { id: "a-3", name: "Terminal.app", type: "file", icon: <Terminal className="text-gray-100" /> },
    { id: "a-4", name: "Messages.app", type: "file", icon: <MessageSquare className="text-green-500" /> },
  ],
  "Documents": [
    { id: "folder-1", name: "Work Projects", type: "folder" },
    { id: "folder-2", name: "Personal", type: "folder" },
    { id: "f-4", name: "Resume_2024.pdf", type: "file", icon: <FileText className="text-blue-400" /> },
    { id: "f-5", name: "Budget.xlsx", type: "file", icon: <FileText className="text-green-500" /> },
  ],
  "Documents/Work Projects": [
    { id: "folder-3", name: "Alpha_Release", type: "folder" },
    { id: "f-6", name: "Specs.txt", type: "file", icon: <FileText className="text-gray-400" /> },
  ],
  "Documents/Work Projects/Alpha_Release": [
    { id: "f-7", name: "build_logs.txt", type: "file", icon: <FileText className="text-gray-400" /> },
    { id: "f-8", name: "alpha_screenshot.png", type: "file", icon: <ImageIcon className="text-blue-400" /> },
  ],
  "Documents/Personal": [
    { id: "folder-4", name: "Holiday_Photos", type: "folder" },
    { id: "f-9", name: "Bucket_List.txt", type: "file", icon: <FileText className="text-gray-400" /> },
  ],
  "Downloads": [
    { id: "f-10", name: "macos_sonoma.dmg", type: "file", icon: <FileText className="text-gray-400" /> },
    { id: "f-11", name: "archive.zip", type: "file", icon: <FileText className="text-yellow-500" /> },
  ],
  "iCloud Drive": [
    { id: "folder-5", name: "Shared Documents", type: "folder" },
    { id: "f-12", name: "Backup_Config", type: "file", icon: <Settings className="text-gray-500" /> },
  ]
};

const APPS = [
  { id: "finder", title: "Finder", icon: <Folder className="text-blue-500" />, color: "bg-blue-500/10" },
  { id: "chrome", title: "Safari", icon: <Chrome className="text-blue-400" />, color: "bg-blue-400/10" },
  { id: "mail", title: "Mail", icon: <Mail className="text-blue-600" />, color: "bg-blue-600/10" },
  { id: "messages", title: "Messages", icon: <MessageSquare className="text-green-500" />, color: "bg-green-500/10" },
  { id: "music", title: "Music", icon: <Music className="text-pink-500" />, color: "bg-pink-500/10" },
  { id: "settings", title: "Settings", icon: <Settings className="text-gray-500" />, color: "bg-gray-500/10" },
  { id: "terminal", title: "Terminal", icon: <Terminal className="text-gray-100" />, color: "bg-black" },
  { id: "preview", title: "Preview", icon: <Eye className="text-orange-500" />, color: "bg-orange-500/10" },
  { id: "image_preview", title: "Preview", icon: <ImageIcon className="text-orange-400" />, color: "bg-orange-400/10" },
  { id: "wallpaper_settings", title: "Wallpaper", icon: <Monitor className="text-purple-400" />, color: "bg-purple-400/10" },
  { id: "trash", title: "Trash", icon: <Trash2 className="text-gray-400" />, color: "bg-white/10" },
];

// --- Boot Screen ---

const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate real macOS booting behavior
    // 1. Initial delay
    // 2. Fast start
    // 3. Slow middle (real macOS often hangs a bit around 60-70%)
    // 4. Fast finish
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 30) {
        currentProgress += Math.random() * 5;
      } else if (currentProgress < 70) {
        currentProgress += Math.random() * 2;
      } else if (currentProgress < 100) {
        currentProgress += Math.random() * 8;
      } else {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500); // Small pause at 100%
      }
      setProgress(Math.min(currentProgress, 100));
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center select-none"
    >
      <div className="flex flex-col items-center gap-12 -mt-20">
        <Apple size={80} className="text-white fill-white" />
        
        {/* Progress Bar Container */}
        <div className="w-[200px] h-[4px] bg-[#333333] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- Sub-components ---

const PDFPreviewContent = () => {
  return (
    <div className="flex flex-col h-full bg-[#333333]">
      {/* Preview Toolbar */}
      <div className="h-10 bg-[#444444] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Sidebar size={14} /></button>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[12px]">
            <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={14} /></button>
            <span className="bg-black/30 px-2 py-0.5 rounded text-white/90">1 / 12</span>
            <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={14} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><ZoomOut size={14} /></button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><ZoomIn size={14} /></button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/80"><RotateCw size={14} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/80"><Share size={14} /></button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#222222]">
        <div className="w-[500px] h-[700px] bg-white shadow-2xl flex flex-col p-12 text-gray-800 font-serif relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <h1 className="text-3xl font-bold mb-2">JOSHUA GUNAWAN</h1>
          <p className="text-blue-600 font-sans text-sm mb-8 tracking-widest uppercase">Senior Software Engineer</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Experience</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-sans text-[12px] font-bold">
                    <span>Tech Giant Corp</span>
                    <span>2020 - Present</span>
                  </div>
                  <p className="text-[11px] mt-1 italic">Lead Frontend Developer</p>
                  <ul className="list-disc list-inside text-[10px] mt-2 space-y-1 text-gray-600 leading-relaxed">
                    <li>Architected high-performance macOS-style web interfaces using React and Framer Motion.</li>
                    <li>Optimized rendering performance by 40% through advanced memoization techniques.</li>
                    <li>Led a team of 12 engineers in developing a scalable design system.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between font-sans text-[12px] font-bold">
                    <span>Startup Innovation Lab</span>
                    <span>2018 - 2020</span>
                  </div>
                  <p className="text-[11px] mt-1 italic">Full Stack Engineer</p>
                  <ul className="list-disc list-inside text-[10px] mt-2 space-y-1 text-gray-600 leading-relaxed">
                    <li>Developed real-time collaboration features using WebSockets and Firebase.</li>
                    <li>Implemented secure OAuth2 flows for multiple third-party integrations.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Education</h2>
              <div className="font-sans text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>University of Technology</span>
                  <span>2014 - 2018</span>
                </div>
                <p>B.S. in Computer Science, Magna Cum Laude</p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "Firebase", "PostgreSQL", "Docker"].map(skill => (
                  <span key={skill} className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-sans font-medium text-gray-700">{skill}</span>
                ))}
              </div>
            </section>
          </div>
          
          <div className="mt-auto pt-8 border-t border-gray-100 text-[9px] text-gray-400 font-sans flex justify-between">
            <span>jtgunawan007@gmail.com</span>
            <span>www.jgunawan.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarWidget = () => {
  const date = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[160px] h-[160px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group select-none pointer-events-auto cursor-default"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500/60" />
      <span className="text-red-500 font-bold text-[14px] tracking-[0.1em] mb-1">{dayName}</span>
      <span className="text-white text-6xl font-extralight tracking-tighter">{dayNumber}</span>
      <div className="mt-2 text-[10px] text-white/40 font-medium tracking-wide">No more events today</div>
    </motion.div>
  );
};

const WeatherWidget = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay: 0.1 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[160px] h-[160px] bg-blue-600/20 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 flex flex-col justify-between shadow-2xl group select-none pointer-events-auto cursor-default"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-white font-bold text-[15px] tracking-tight text-shadow-sm">Jakarta</span>
          <span className="text-white/70 text-[12px] font-medium">Sunny</span>
        </div>
        <div className="relative">
          <Sun size={24} className="text-yellow-400 fill-yellow-400/30 animate-pulse" />
          <div className="absolute inset-0 blur-md bg-yellow-400/20 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-white text-5xl font-extralight tracking-tighter">28°</span>
        <div className="flex gap-2 mt-1 text-[11px] font-medium text-white/60">
          <span className="flex items-center gap-0.5">H:31°</span>
          <span className="flex items-center gap-0.5">L:24°</span>
        </div>
      </div>
    </motion.div>
  );
};

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[24px] bg-black/30 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-3 z-[1000] text-[13px] text-white font-medium select-none"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4">
        <Apple size={14} className="fill-white" />
        <span className="font-bold">Finder</span>
        <span className="opacity-80 font-normal">File</span>
        <span className="opacity-80 font-normal">Edit</span>
        <span className="opacity-80 font-normal">View</span>
        <span className="opacity-80 font-normal">Go</span>
        <span className="opacity-80 font-normal">Window</span>
        <span className="opacity-80 font-normal">Help</span>
      </div>
      <div className="flex items-center gap-4">
        <Wifi size={14} className="opacity-80" />
        <Search size={14} className="opacity-80" />
        <Volume2 size={14} className="opacity-80" />
        <Battery size={16} className="opacity-80" />
        <div className="flex items-center gap-2">
          <span className="opacity-80 font-normal">{time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</span>
          <span className="opacity-80 font-normal">{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
};

const ContextMenu = ({ x, y, onCreateFolder, onChangeWallpaper }: { x: number; y: number; onCreateFolder: () => void; onChangeWallpaper: () => void }) => {
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

const Window: React.FC<{ 
  app: WindowState; 
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  onFocus: () => void;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
}> = ({ 
  app, 
  onClose, 
  onMinimize, 
  zIndex, 
  onFocus,
  dragConstraints
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
      onClick={(e) => e.stopPropagation()}
    >
      {/* Window Title Bar */}
      <div 
        className="h-[52px] flex items-center justify-between px-4 relative border-b border-white/5 cursor-default select-none" 
        onPointerDown={(e) => dragControls.start(e)}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex gap-2 group z-10 w-[60px]" onPointerDown={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center text-transparent hover:text-black/60 transition-colors"
          >
            <X size={8} strokeWidth={4} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center text-transparent hover:text-black/60 transition-colors"
          >
            <Minus size={8} strokeWidth={4} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center text-transparent hover:text-black/60 transition-colors"
          >
            <Maximize2 size={8} strokeWidth={4} />
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 text-white/70 font-semibold text-[13px]">
            {app.icon}
            {app.title}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden text-white">
        {app.content}
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZ, setMaxZ] = useState(100);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].url);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [launchingApps, setLaunchingApps] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [finderFiles, setFinderFiles] = useState(INITIAL_MOCK_FILES);
  const trashRef = useRef<HTMLDivElement>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([
    { 
      id: 'mac-hd', 
      type: 'folder', 
      label: 'Macintosh HD', 
      icon: <Folder size={40} className="text-blue-200 fill-blue-500/80" />,
      onClick: () => openApp('finder', { initialPath: 'Documents' })
    },
    { 
      id: 'work-project', 
      type: 'folder', 
      label: 'Work Project', 
      icon: <Folder size={40} className="text-blue-200 fill-blue-500/80" />,
      onClick: () => openApp('finder', { initialPath: 'Documents/Work Projects' })
    },
    { 
      id: 'resume', 
      type: 'file', 
      label: 'Resume.pdf', 
      icon: <FileText size={40} className="text-white fill-gray-400" />,
      onClick: () => openApp('preview')
    },
    { 
      id: 'design', 
      type: 'file', 
      label: 'Design_v2.jpg', 
      icon: <ImageIcon size={40} className="text-white fill-pink-400" />,
      onClick: () => openApp('image_preview')
    },
  ]);

  // Sync windows content
  useEffect(() => {
    setWindows(prev => prev.map(w => {
      if (w.id === 'wallpaper_settings') {
        return { 
          ...w, 
          content: <WallpaperSettingsContent current={wallpaper} onSelect={setWallpaper} />
        };
      }
      if (w.id === 'finder') {
        // Find existing path or default to Documents
        const currentPath = (w.content as any)?.props?.initialPath || "Documents";
        return {
          ...w,
          content: <FinderContent 
            onOpenApp={openApp} 
            initialPath={currentPath} 
            files={finderFiles} 
            onMoveToTrash={moveToTrashFromFinder} 
          />
        };
      }
      if (w.id === 'trash') {
        return {
          ...w,
          content: <TrashContent items={trashItems} onEmpty={() => setTrashItems([])} onPutBack={putBackItem} />
        };
      }
      return w;
    }));
  }, [wallpaper, finderFiles, trashItems]);

  const desktopRef = useRef<HTMLDivElement>(null);
  
  // App Switcher State
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [switcherIndex, setSwitcherIndex] = useState(0);

  // Keyboard Listeners for Command + Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Logic for Command (Meta) + Tab
      if (e.metaKey && e.key === "Tab") {
        e.preventDefault();
        
        if (windows.length === 0) return;

        if (!isSwitcherOpen) {
          setIsSwitcherOpen(true);
          // Start focus on the second app (the one to switch to) or first if only one
          setSwitcherIndex(windows.length > 1 ? 1 : 0);
        } else {
          // Cycle through indices
          setSwitcherIndex(prev => (prev + 1) % windows.length);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // When Command is released
      if (!e.metaKey && isSwitcherOpen) {
        setIsSwitcherOpen(false);
        const targetApp = windows[switcherIndex];
        if (targetApp) {
          focusApp(targetApp.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSwitcherOpen, switcherIndex, windows, maxZ]);

  const openApp = (appId: string, options?: { initialPath?: string }) => {
    const appInfo = APPS.find(a => a.id === appId);
    if (!appInfo) return;

    // Check if already open
    const existingIndex = windows.findIndex(w => w.id === appId);
    if (existingIndex !== -1) {
      setWindows(prev => {
        const next = [...prev];
        const existingWindow = next[existingIndex];
        
        // If we have a new initialPath for Finder, update its content
        let updatedContent = existingWindow.content;
        if (appId === 'finder' && options?.initialPath) {
          updatedContent = <FinderContent 
            onOpenApp={openApp} 
            initialPath={options.initialPath} 
            files={finderFiles} 
            onMoveToTrash={moveToTrashFromFinder} 
          />;
        }

        next[existingIndex] = { 
          ...existingWindow, 
          isMinimized: false, 
          zIndex: maxZ + 1,
          content: updatedContent 
        };
        return next;
      });
      setMaxZ(prev => prev + 1);
      return;
    }

    // Prevent multiple launches for the same app
    if (launchingApps.includes(appId)) return;

    // Bounce effect for new apps
    setLaunchingApps(prev => [...prev, appId]);
    
    // Simulate loading time
    setTimeout(() => {
      const newWindow: WindowState = {
        id: appInfo.id,
        title: appInfo.title,
        icon: appInfo.icon,
        isOpen: true,
        isMinimized: false,
        zIndex: maxZ + 1,
        content: appId === 'preview' ? <PDFPreviewContent /> : 
                 appId === 'image_preview' ? <ImagePreviewContent /> : 
                 appId === 'wallpaper_settings' ? <WallpaperSettingsContent current={wallpaper} onSelect={setWallpaper} /> :
                 appId === 'finder' ? <FinderContent onOpenApp={openApp} initialPath={options?.initialPath} files={finderFiles} onMoveToTrash={moveToTrashFromFinder} /> :
                 appId === 'trash' ? <TrashContent items={trashItems} onEmpty={() => setTrashItems([])} onPutBack={putBackItem} /> :
                 appId === 'terminal' ? <TerminalContent files={finderFiles} /> :
                 <MockAppContent id={appId} name={appInfo.title} />
      };

      setWindows(prev => [...prev, newWindow]);
      setMaxZ(prev => prev + 1);
      setLaunchingApps(prev => prev.filter(id => id !== appId));
    }, 1200);
  };

  const isDroppedOnTrash = (point: { x: number; y: number }) => {
    if (!trashRef.current) return false;
    const rect = trashRef.current.getBoundingClientRect();
    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    );
  };

  const moveToTrashFromDesktop = (itemId: string, point: { x: number; y: number }) => {
    if (isDroppedOnTrash(point)) {
      const item = desktopItems.find(i => i.id === itemId);
      if (item) {
        setTrashItems(prev => [...prev, { ...item, source: 'desktop' }]);
        setDesktopItems(prev => prev.filter(i => i.id !== itemId));
      }
    }
  };

  const moveToTrashFromFinder = (file: any, path: string, point: { x: number; y: number }) => {
    if (isDroppedOnTrash(point)) {
      setTrashItems(prev => [...prev, { ...file, source: 'finder', originalPath: path }]);
      setFinderFiles(prev => ({
        ...prev,
        [path]: prev[path].filter(f => f.id !== file.id || f.name !== file.name)
      }));
    }
  };

  const putBackItem = (item: any) => {
    if (item.source === 'desktop') {
      setDesktopItems(prev => [...prev, { id: item.id, type: item.type, label: item.label, icon: item.icon, onClick: item.onClick }]);
    } else if (item.source === 'finder') {
      setFinderFiles(prev => ({
        ...prev,
        [item.originalPath]: [...(prev[item.originalPath] || []), { id: item.id, name: item.name, type: item.type, icon: item.icon }]
      }));
    }
    setTrashItems(prev => prev.filter(i => i.id !== item.id));
  };

  const closeApp = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeApp = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const focusApp = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    setMaxZ(prev => prev + 1);
  };

  const createFolder = () => {
    const newId = `folder-${Date.now()}`;
    const newFolder: DesktopItem = {
      id: newId,
      type: 'folder',
      label: 'Untitled Folder',
      icon: <Folder size={40} className="text-blue-200 fill-blue-500/80" />,
      onClick: () => openApp('finder', { initialPath: 'Documents' })
    };
    setDesktopItems(prev => [...prev, newFolder]);
    setContextMenu(null);
    setEditingId(newId);
    setSelectedId(newId);
  };

  const handleRename = (id: string, newName: string) => {
    setDesktopItems(prev => prev.map(item => 
      item.id === id ? { ...item, label: newName || item.label } : item
    ));
    setEditingId(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isBooting && <BootScreen key="boot" onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      <div 
        ref={desktopRef}
        className="fixed inset-0 overflow-hidden font-sans select-none bg-black"
        style={{ visibility: isBooting ? 'hidden' : 'visible' }}
        onClick={() => {
        setSelectedId(null);
        setContextMenu(null);
      }}
      onContextMenu={handleContextMenu}
      id="desktop-root"
    >
      {/* Background Wallpaper */}
      <motion.div 
        key={wallpaper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      
      {/* Overlays for depth */}
      <div className="absolute inset-0 bg-black/5" />

      <TopBar />

      {/* Widgets Layer (macOS Tahoe style) */}
      <div className="absolute top-[60px] left-[60px] flex flex-col gap-6 pointer-events-none">
        <CalendarWidget />
        <WeatherWidget />
      </div>

      {/* Desktop Icons - Grid layout on the right */}
      <div 
        className="absolute top-10 right-6 bottom-24 flex flex-col flex-wrap-reverse gap-[30px] content-end items-end p-4 pointer-events-none h-full"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedId(null);
        }}
      >
        {desktopItems.map(item => (
          <DesktopIcon 
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={selectedId === item.id}
            isEditing={editingId === item.id}
            onOpen={item.onClick}
            onSelect={() => setSelectedId(item.id)}
            onStartEdit={() => setEditingId(item.id)}
            onRename={(newName) => handleRename(item.id, newName)}
            onDragEnd={(point) => moveToTrashFromDesktop(item.id, point)}
            dragConstraints={desktopRef}
          />
        ))}
      </div>

      {/* Windows Layer */}
      <AnimatePresence>
        {windows.filter(w => !w.isMinimized).map(w => (
          <Window 
            key={w.id} 
            app={w} 
            onClose={() => closeApp(w.id)} 
            onMinimize={() => minimizeApp(w.id)}
            zIndex={w.zIndex}
            onFocus={() => focusApp(w.id)}
            dragConstraints={desktopRef}
          />
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <ContextMenu 
              x={contextMenu.x} 
              y={contextMenu.y} 
              onCreateFolder={createFolder} 
              onChangeWallpaper={() => {
                openApp('wallpaper_settings');
                setContextMenu(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Switcher Overlay */}
      <AnimatePresence>
        {isSwitcherOpen && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-black/40 backdrop-blur-3xl border border-white/20 rounded-[30px] p-6 flex gap-6 shadow-[0_0_100px_rgba(0,0,0,0.5)] pointer-events-auto"
            >
              {windows.map((win, idx) => (
                <div 
                  key={win.id} 
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${idx === switcherIndex ? 'bg-white/20 ring-1 ring-white/30' : 'opacity-60'}`}
                >
                  <div className="scale-[2.5] mb-4">
                    {win.icon}
                  </div>
                  <span className="text-white text-sm font-semibold">{win.title}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dock Area */}
      <div 
        className="fixed bottom-[10px] left-1/2 -translate-x-1/2 z-[2000] w-fit"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="bg-[#141414]/40 backdrop-blur-[25px] border border-white/10 rounded-[20px] p-2 flex items-end gap-2 px-3 pb-2 shadow-2xl relative"
        >
          {APPS.map((app) => (
            <DockIcon 
              key={app.id} 
              app={app} 
              onClick={() => openApp(app.id)} 
              isOpen={windows.some(w => w.id === app.id)}
              isMinimized={windows.find(w => w.id === app.id)?.isMinimized}
              isLaunching={launchingApps.includes(app.id)}
            />
          ))}
          <div className="w-px h-8 bg-white/20 mx-1 mb-2" />
          <DockIcon 
            ref={trashRef}
            app={{ id: "trash", title: "Trash", icon: trashItems.length > 0 ? <Trash2 className="text-blue-200 fill-blue-500/50" /> : <Trash2 className="text-gray-400" />, color: "bg-white/10" }} 
            onClick={() => openApp('trash')} 
            isOpen={windows.some(w => w.id === 'trash')}
          />
        </motion.div>
      </div>
    </div>
  </>
  );
}

interface DesktopIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  isEditing?: boolean;
  onOpen?: () => void;
  onSelect?: () => void;
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
  const [tempLabel, setTempLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (onRename) onRename(tempLabel);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setTempLabel(label);
      if (onRename) onRename(label);
    }
  };

  return (
    <motion.div 
      drag
      onDragEnd={(_, info) => onDragEnd?.(info.point)}
      dragConstraints={dragConstraints}
      dragElastic={0.05}
      dragMomentum={false}
      className={`flex flex-col items-center gap-1.5 w-20 p-2 rounded-lg cursor-default pointer-events-auto transition-colors group z-10 ${isSelected && !isEditing ? 'bg-white/20' : 'hover:bg-white/10 active:bg-white/20'}`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen?.();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isSelected && !isEditing && onStartEdit) {
          // macos style: click again on label to rename
          // but here we just simplify it to click anywhere on selected icon to allow edit
          // let's actually make it click on the label specifically for better feel
        } else {
          onSelect?.();
        }
      }}
    >
      <div className="w-[60px] h-[60px] bg-white/20 rounded-xl border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm pointer-events-none">
        {icon}
      </div>
      
      {isEditing ? (
        <input
          ref={inputRef}
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="text-[12px] text-white bg-blue-600 outline-none border-none rounded-sm px-1 text-center w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span 
          className={`text-[12px] text-white font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center line-clamp-2 px-1 pointer-events-auto select-none rounded-sm ${isSelected ? 'bg-blue-600' : ''}`}
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

const DockIcon = React.forwardRef<HTMLDivElement, { 
  app: any; 
  onClick: () => void; 
  isOpen?: boolean;
  isMinimized?: boolean;
  isLaunching?: boolean;
}>(({ 
  app, 
  onClick, 
  isOpen, 
  isMinimized,
  isLaunching
}, ref) => {
  const handleClick = () => {
    onClick();
  };

  const animationVariants = {
    launching: { 
      y: [0, -20, 0],
      transition: { 
        duration: 0.6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    },
    idle: { 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 25
      } 
    }
  };

  return (
    <div ref={ref} className="relative group flex flex-col items-center h-full pt-1">
      {/* Label Tooltip */}
      <div className="absolute bottom-full mb-6 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-white/10 hidden sm:block">
        {app.title}
      </div>

      {/* Icon */}
      <motion.button
        whileHover={{ scale: 1.3, y: -10, marginInline: 6 }}
        animate={isLaunching ? "launching" : "idle"}
        variants={animationVariants}
        onClick={handleClick}
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center p-2.5 shadow-lg border border-white/10 ${app.color || "bg-white/20 hover:bg-white/40"} backdrop-blur-md transition-colors relative overflow-hidden`}
      >
        <div className="w-full h-full flex items-center justify-center transition-transform group-hover:scale-110">
          {app.icon}
        </div>
      </motion.button>

      {/* Active Indicator Dot */}
      <div className="h-1 mt-1 flex justify-center w-full">
        {(isOpen || isLaunching) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isMinimized ? 0.3 : 1, scale: 1 }}
            className="w-1 h-1 bg-white/60 rounded-full transition-opacity" 
          />
        )}
      </div>
    </div>
  );
});

const ImagePreviewContent = () => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Preview Toolbar */}
      <div className="h-10 bg-[#323232] border-b border-black/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Sidebar size={14} /></button>
          </div>
          <div className="text-white/60 text-[12px] font-medium">Design_v2.jpg — 1920 × 1080</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><ZoomOut size={14} /></button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><ZoomIn size={14} /></button>
          </div>
          <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><RotateCw size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Crop size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-white/80"><Pencil size={14} /></button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/80"><Share size={14} /></button>
        </div>
      </div>

      {/* Image Content Area */}
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

const WallpaperSettingsContent = ({ current, onSelect }: { current: string; onSelect: (url: string) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Desktop Wallpaper</h2>
        <div className="grid grid-cols-2 gap-4">
          {WALLPAPERS.map((wp) => (
            <div 
              key={wp.url}
              className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${current === wp.url ? 'border-blue-500 scale-[1.02]' : 'border-transparent hover:border-white/20'}`}
              onClick={() => onSelect(wp.url)}
            >
              <img 
                src={wp.url} 
                alt={wp.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[12px] font-medium">{wp.name}</span>
              </div>
              {current === wp.url && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FinderContent = ({ onOpenApp, initialPath, files, onMoveToTrash }: { 
  onOpenApp: (appId: string, options?: any) => void; 
  initialPath?: string;
  files: Record<string, any[]>;
  onMoveToTrash: (file: any, path: string, point: { x: number; y: number }) => void;
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath || "Recents");
  const [history, setHistory] = useState<string[]>([initialPath || "Recents"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (initialPath) {
      setCurrentPath(initialPath);
      // Reset history when opening a specific folder from outside
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
      {/* Finder Toolbar */}
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
        {/* Sidebar */}
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

        {/* Main Content Grid */}
        <section className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 content-start overflow-auto bg-[#1a1a1a]/40">
          {items.map(file => (
            <div 
              key={file.name} 
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
                  // Open files with appropriate apps
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
                  <Folder size={48} className="text-blue-400 fill-blue-500/30" />
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
              <Folder size={64} className="opacity-10" />
              <span className="text-sm font-medium tracking-wide">No items found</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const MockAppContent = ({ id, name }: { id: string; name: string }) => {
  // Finder-like layout for most apps
  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[160px] border-r border-white/5 p-3 space-y-4">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase px-2 mb-1.5">Favorites</div>
          {["AirDrop", "Recents", "Applications", "Documents", "Downloads"].map(item => (
            <div key={item} className={`px-2 py-1 rounded-md text-[12px] cursor-default ${item === 'Recents' ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5'}`}>
              {item}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase px-2 mb-1.5">iCloud</div>
          {["iCloud Drive", "Shared"].map(item => (
            <div key={item} className="px-2 py-1 rounded-md text-[12px] text-white/80 hover:bg-white/5 cursor-default">
              {item}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Grid */}
      <section className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start overflow-auto">
        {[
          { name: "Presentation.pptx", icon: <FileText className="text-orange-400" /> },
          { name: "Invoice_04.pdf", icon: <FileText className="text-red-400" /> },
          { name: "Screenshot.png", icon: <ImageIcon className="text-blue-400" /> },
          { name: "Notes.txt", icon: <FileText className="text-gray-400" /> },
          { name: "Logo_Final.svg", icon: <ImageIcon className="text-purple-400" /> },
          { name: "Video_Edit.mov", icon: <ImageIcon className="text-pink-400" /> },
        ].map(file => (
          <div key={file.name} className="flex flex-col items-center gap-1 group cursor-default">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
              {file.icon}
            </div>
            <span className="text-[11px] text-white/90 text-center line-clamp-2 px-1">{file.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

const TrashContent = ({ items, onEmpty, onPutBack }: { items: any[]; onEmpty: () => void; onPutBack: (item: any) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Trash Toolbar */}
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

const TerminalContent = ({ files }: { files: Record<string, any[]> }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("Documents");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const args = trimmedCmd.toLowerCase().split(' ');
    const mainCmd = args[0];
    let output: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-[100px,1fr] gap-x-4 text-white/50">
            <span className="text-blue-400 font-bold">ls</span><span>list directory contents</span>
            <span className="text-blue-400 font-bold">cd [dir]</span><span>change directory</span>
            <span className="text-blue-400 font-bold">cat [file]</span><span>show file content</span>
            <span className="text-blue-400 font-bold">clear</span><span>clear terminal screen</span>
            <span className="text-blue-400 font-bold">neofetch</span><span>show system information</span>
            <span className="text-blue-400 font-bold">date</span><span>print current date</span>
            <span className="text-blue-400 font-bold">whoami</span><span>print effective user id</span>
            <span className="text-blue-400 font-bold">pwd</span><span>print working directory</span>
            <span className="text-blue-400 font-bold">help</span><span>show this help message</span>
          </div>
        );
        break;
      case 'ls':
        const currentFiles = files[currentPath] || [];
        output = (
          <div className="flex flex-wrap gap-x-6">
            {currentFiles.map(f => (
              <span key={f.id} className={f.type === 'folder' ? 'text-blue-400 font-bold' : 'text-white'}>
                {f.name}
              </span>
            ))}
          </div>
        );
        break;
      case 'pwd':
        output = <div className="text-white/80">/Users/hadigunawan/{(currentPath)}</div>;
        break;
      case 'whoami':
        output = <div className="text-white/80">hadigunawan</div>;
        break;
      case 'date':
        output = <div className="text-white/80">{new Date().toString()}</div>;
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'neofetch':
        output = (
          <div className="flex gap-6 mt-2">
            <div className="text-white font-bold text-lg leading-none opacity-50">
              ####<br/>
              ######<br/>
              ###<br/>
              ###<br/>
              ######<br/>
              ####
            </div>
            <div className="text-[12px] opacity-90">
              <span className="text-blue-400 font-bold">user@macbook-pro</span><br/>
              ------------------<br/>
              <span className="text-blue-400 font-bold">OS:</span> macOS Web Clone 14.0<br/>
              <span className="text-blue-400 font-bold">Kernel:</span> x86_64 Webkit<br/>
              <span className="text-blue-400 font-bold">Uptime:</span> 1 hour<br/>
              <span className="text-blue-400 font-bold">Shell:</span> hadish 1.0<br/>
              <span className="text-blue-400 font-bold">Resolution:</span> {window.innerWidth}x{window.innerHeight}<br/>
              <span className="text-blue-400 font-bold">DE:</span> Aqua-React<br/>
              <span className="text-blue-400 font-bold">WM:</span> Framer-Motion<br/>
            </div>
          </div>
        );
        break;
      case 'cd':
        const targetDir = args[1];
        if (!targetDir || targetDir === '~') {
          setCurrentPath("Documents");
        } else if (targetDir === '..') {
          const parts = currentPath.split('/');
          if (parts.length > 1) {
            parts.pop();
            setCurrentPath(parts.join('/'));
          } else {
            setCurrentPath("Documents");
          }
        } else {
          const folders = (files[currentPath] || []).filter(f => f.type === 'folder');
          const found = folders.find(f => f.name.toLowerCase() === targetDir.toLowerCase());
          if (found) {
            setCurrentPath(prev => `${prev}/${found.name}`);
          } else {
            output = <div className="text-red-400">cd: no such directory: {targetDir}</div>;
          }
        }
        break;
      case 'cat':
        const fileToRead = args[1];
        if (!fileToRead) {
          output = <div className="text-red-400">usage: cat [file]</div>;
        } else {
          const foundFile = (files[currentPath] || []).find(f => f.name.toLowerCase() === fileToRead.toLowerCase() && f.type === 'file');
          if (foundFile) {
            output = <div className="text-white/80 opacity-70 mt-1 whitespace-pre-wrap px-2 border-l border-white/10">This is the simulated content of {foundFile.name}.\nIn a real terminal, you would see the file text right here.</div>;
          } else {
            output = <div className="text-red-400">cat: {fileToRead}: No such file</div>;
          }
        }
        break;
      case '':
        break;
      default:
        output = <div className="text-white/60">zsh: command not found: {mainCmd}</div>;
    }

    setHistory(prev => [...prev, { cmd: trimmedCmd, output, path: currentPath }]);
    setInput("");
  };

  return (
    <div 
      className="bg-[#1e1e1e]/95 backdrop-blur-xl text-green-400 font-mono p-4 h-full text-sm leading-relaxed overflow-auto scroll-smooth"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="text-gray-500 mb-4 opacity-70">Last login: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} on ttys001</div>
      
      {history.map((line, i) => (
        <div key={i} className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium opacity-80">macbook-pro</span>
            <span className="text-blue-400">~{line.path.replace('Documents', '') || ''} $</span>
            <span className="text-blue-200">{line.cmd}</span>
          </div>
          {line.output && <div className="mt-1 pl-4 mb-2">{line.output}</div>}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <span className="text-white font-medium opacity-80">macbook-pro</span>
        <span className="text-blue-400">~{currentPath.replace('Documents', '') || ''} $</span>
        <form onSubmit={(e) => { e.preventDefault(); executeCommand(input); }} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-blue-200 w-full p-0 font-mono"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

