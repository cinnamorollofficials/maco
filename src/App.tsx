import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, Trash2 } from "lucide-react";

// Types & Constants
import { WindowState, DesktopItem } from "./types";
import { APPS, INITIAL_MOCK_FILES } from "./constants";

// Core Components
import BootScreen from "./components/BootScreen";
import TopBar from "./components/TopBar";
import DockIcon from "./components/DockIcon";
import DesktopIcon from "./components/DesktopIcon";
import Window from "./components/Window";
import ContextMenu from "./components/ContextMenu";
import CalendarWidget from "./components/CalendarWidget";
import WeatherWidget from "./components/WeatherWidget";

// App Contents
import FinderContent from "./components/apps/FinderContent";
import SafariContent from "./components/apps/SafariContent";
import NotesContent from "./components/apps/NotesContent";
import TerminalContent from "./components/apps/TerminalContent";
import WallpaperSettingsContent from "./components/apps/WallpaperSettingsContent";
import PDFPreviewContent from "./components/apps/PDFPreviewContent";
import ImagePreviewContent from "./components/apps/ImagePreviewContent";
import MockAppContent from "./components/apps/MockAppContent";

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [launchingApps, setLaunchingApps] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop");
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ start: { x: number, y: number }, current: { x: number, y: number } } | null>(null);
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>("Welcome to Notes!\n\nYou can use this app to jot down your ideas.");
  const [weatherCondition, setWeatherCondition] = useState({ temp: 28, condition: "Sunny" });
  const [finderFiles, setFinderFiles] = useState(INITIAL_MOCK_FILES);
  const isSelecting = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherCondition(prev => {
        const conditions = ["Sunny", "Cloudy", "Partly Cloudy"];
        const nextCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const nextTemp = prev.temp + (Math.random() > 0.5 ? 1 : -1);
        return { temp: Math.max(20, Math.min(35, nextTemp)), condition: nextCondition };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const trashRef = useRef<HTMLDivElement>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([
    { 
      id: "finder-desktop", 
      type: "folder", 
      label: "Documents", 
      icon: <img src="/folder-icon-macos.png" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'Documents' })
    },
    { 
      id: "finder-desktop", 
      type: "folder", 
      label: "Portfolio", 
      icon: <img src="/folder-icon-macos.png" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'Portfolio' })
    },
    { 
      id: "trash-desktop", 
      type: "file", 
      label: "Trash", 
      icon: <img src="/trash_icon.png" className="w-14 h-14 object-contain" alt="trash" />,
      onClick: () => openApp('trash')
    }
  ]);

  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'Tab') {
        e.preventDefault();
        if (windows.length > 0) {
          const currentPath = (activeWindow as any) || windows[0].id;
          const currentIndex = windows.findIndex(w => w.id === currentPath);
          const nextIndex = (currentIndex + 1) % windows.length;
          focusApp(windows[nextIndex].id);
        }
      }

      // Arrow navigation for desktop
      if (!activeWindow) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIds(prev => {
            const currentIndex = desktopItems.findIndex(item => prev.includes(item.id));
            const nextIndex = (currentIndex + 1) % desktopItems.length;
            return [desktopItems[nextIndex].id];
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIds(prev => {
            const currentIndex = desktopItems.findIndex(item => prev.includes(item.id));
            const nextIndex = (currentIndex - 1 + desktopItems.length) % desktopItems.length;
            return [desktopItems[nextIndex].id];
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, activeWindow, desktopItems]);

  const openApp = (appId: string, options?: { initialPath?: string }) => {
    const appInfo = APPS.find(a => a.id === appId);
    if (!appInfo) return;

    const existingIndex = windows.findIndex(w => w.id === appId);
    if (existingIndex !== -1) {
      setWindows(prev => {
        const next = [...prev];
        const existingWindow = next[existingIndex];
        next.splice(existingIndex, 1);
        next.push({ ...existingWindow, isMinimized: false, zIndex: Math.max(...prev.map(w => w.zIndex), 0) + 1 });
        return next;
      });
      setActiveWindow(appId);
      return;
    }

    setLaunchingApps(prev => [...prev, appId]);
    
      setTimeout(() => {
      const content = 
                 appId === 'terminal' ? <TerminalContent files={finderFiles} isFocused={activeWindow === 'terminal'} /> :
                 appId === 'chrome' ? <SafariContent /> :
                 appId === 'notes' ? <NotesContent value={notes} onChange={setNotes} /> :
                 appId === 'preview' ? <PDFPreviewContent /> :
                 appId === 'image_preview' ? <ImagePreviewContent /> :
                 appId === 'finder' ? (
                   <FinderContent 
                     onOpenApp={openApp} 
                     initialPath={options?.initialPath} 
                     files={finderFiles} 
                     onMoveToTrash={moveToTrashFromFinder} 
                     isFocused={activeWindow === 'finder'}
                     trashItems={trashItems}
                     onEmptyTrash={() => setTrashItems([])}
                     onPutBack={putBackItem}
                   />
                 ) :
                 appId === 'trash' ? (
                   <FinderContent 
                     onOpenApp={openApp} 
                     initialPath="Trash" 
                     files={finderFiles} 
                     onMoveToTrash={moveToTrashFromFinder} 
                     isFocused={activeWindow === 'trash'}
                     trashItems={trashItems}
                     onEmptyTrash={() => setTrashItems([])}
                     onPutBack={putBackItem}
                   />
                 ) :
                 <MockAppContent id={appId} name={appInfo.title} />;
      
      const newWindow: WindowState = {
        id: appInfo.id,
        title: appInfo.title,
        icon: appInfo.icon,
        isOpen: true,
        isMinimized: false,
        zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
        content: content
      };

      setWindows(prev => [...prev, newWindow]);
      setActiveWindow(appId);
      setLaunchingApps(prev => prev.filter(id => id !== appId));
    }, 800);
  };

  const isDroppedOnTrash = (point: { x: number; y: number }) => {
    // Check Dock Trash
    if (trashRef.current) {
      const rect = trashRef.current.getBoundingClientRect();
      if (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      ) return true;
    }

    // Check Desktop Trash
    const desktopTrashEl = document.getElementById('icon-trash-desktop');
    if (desktopTrashEl) {
      const rect = desktopTrashEl.getBoundingClientRect();
      if (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      ) return true;
    }

    return false;
  };

  const moveToTrashFromDesktop = (itemId: string, point: { x: number; y: number }) => {
    if (isDroppedOnTrash(point)) {
      // Handle multi-select: if the dragged item is part of selection, move all
      const itemsToMove = selectedIds.includes(itemId) ? selectedIds : [itemId];
      const items = desktopItems.filter(i => itemsToMove.includes(i.id) && i.id !== 'trash-desktop');
      
      if (items.length > 0) {
        setTrashItems(prev => [...prev, ...items.map(item => ({ ...item, originalPath: 'Desktop' }))]);
        setDesktopItems(prev => prev.filter(i => !itemsToMove.includes(i.id) || i.id === 'trash-desktop'));
        setSelectedIds([]);
      }
    }
  };

  const moveToTrashFromFinder = (file: any, path: string, point: { x: number; y: number }) => {
    if (isDroppedOnTrash(point)) {
      setTrashItems(prev => [...prev, { ...file, originalPath: path }]);
      setFinderFiles(prev => ({
        ...prev,
        [path]: prev[path].filter(f => f.id !== file.id)
      }));
    }
  };

  const putBackItem = (item: any) => {
    if (item.originalPath === 'Desktop') {
      const { originalPath, ...rest } = item;
      setDesktopItems(prev => [...prev, rest]);
    } else {
      const { originalPath, ...rest } = item;
      setFinderFiles(prev => ({
        ...prev,
        [originalPath]: [...(prev[originalPath] || []), rest]
      }));
    }
    setTrashItems(prev => prev.filter(i => i.id === item.id ? false : true));
  };

  const closeApp = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  };

  const minimizeApp = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindow(null);
  };

  const focusApp = (id: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    setActiveWindow(id);
  };

  const handleSelectionStart = (e: React.MouseEvent) => {
    if (e.target !== desktopRef.current) return;
    setSelection({ 
      start: { x: e.clientX, y: e.clientY }, 
      current: { x: e.clientX, y: e.clientY } 
    });
    setSelectedIds([]);
    setEditingId(null);
  };

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!selection) return;
    const current = { x: e.clientX, y: e.clientY };
    setSelection(prev => prev ? { ...prev, current } : null);

    // If moved more than 5px, it's a marquee selection
    if (Math.abs(current.x - selection.start.x) > 5 || Math.abs(current.y - selection.start.y) > 5) {
      isSelecting.current = true;
    }

    const rect = {
      x1: selection.start.x,
      y1: selection.start.y,
      x2: current.x,
      y2: current.y
    };

    const xMin = Math.min(rect.x1, rect.x2);
    const xMax = Math.max(rect.x1, rect.x2);
    const yMin = Math.min(rect.y1, rect.y2);
    const yMax = Math.max(rect.y1, rect.y2);

    const newlySelected: string[] = [];
    desktopItems.forEach(item => {
      const el = document.getElementById(`icon-${item.id}`);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.left < xMax && r.right > xMin && r.top < yMax && r.bottom > yMin) {
          newlySelected.push(item.id);
        }
      }
    });
    setSelectedIds(newlySelected);
  };

  const handleSelectionEnd = () => {
    setSelection(null);
  };

  const createFolder = () => {
    const newId = `folder-${Date.now()}`;
    const newFolder: DesktopItem = {
      id: newId,
      type: 'folder',
      label: 'untitled folder',
      icon: <img src="/folder-icon-macos.png" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'untitled folder' })
    };
    setDesktopItems(prev => [...prev, newFolder]);
    setContextMenu(null);
    setEditingId(newId);
    setSelectedIds([newId]);
  };

  const handleRename = (id: string, newName: string) => {
    setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, label: newName } : item));
    setEditingId(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  if (!isBooted) {
    return <BootScreen onComplete={() => setIsBooted(true)} />;
  }

  return (
  <>
    <div 
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out"
      style={{ backgroundImage: wallpaper.startsWith('linear-gradient') ? wallpaper : `url(${wallpaper})` }}
      onClick={() => { 
        if (!isSelecting.current) {
          setContextMenu(null); 
          setSelectedIds([]); 
          setEditingId(null); 
        }
        isSelecting.current = false;
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleSelectionStart}
      onMouseMove={handleSelectionMove}
      onMouseUp={handleSelectionEnd}
    >
      <TopBar />

      {/* Widgets Layer */}
      <div className="absolute top-[60px] left-[60px] flex flex-col gap-6 pointer-events-none">
        <CalendarWidget />
        <WeatherWidget weatherCondition={weatherCondition} />
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-[40px] right-4 bottom-[100px] w-[120px] grid grid-rows-[repeat(auto-fill,110px)] gap-2 content-start justify-items-center p-4 pointer-events-none">
        {desktopItems.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <DesktopIcon 
              id={item.id}
              icon={item.icon} 
              label={item.label} 
              isSelected={selectedIds.includes(item.id)}
              isEditing={editingId === item.id}
              onOpen={item.onClick}
              onSelect={(multiSelect) => {
                if (multiSelect) {
                  setSelectedIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                } else {
                  setSelectedIds([item.id]);
                }
              }}
              onRename={(newName) => handleRename(item.id, newName)}
              onStartEdit={() => setEditingId(item.id)}
              onDragEnd={(point) => moveToTrashFromDesktop(item.id, point)}
              dragConstraints={desktopRef}
            />
          </div>
        ))}
      </div>

      {/* Selection Marquee */}
      {selection && (
        <div 
          className="fixed bg-blue-500/20 border border-blue-500/50 z-[4000] pointer-events-none"
          style={{
            left: Math.min(selection.start.x, selection.current.x),
            top: Math.min(selection.start.y, selection.current.y),
            width: Math.abs(selection.start.x - selection.current.x),
            height: Math.abs(selection.start.y - selection.current.y)
          }}
        />
      )}

      {/* Windows Layer */}
      <AnimatePresence>
        {windows.map((win) => (
          !win.isMinimized && (
            <Window 
              key={win.id} 
              app={win} 
              onClose={() => closeApp(win.id)}
              onMinimize={() => minimizeApp(win.id)}
              zIndex={win.zIndex}
              onFocus={() => focusApp(win.id)}
              dragConstraints={desktopRef}
            />
          )
        ))}
      </AnimatePresence>

      {/* Dock Area */}
      <div 
        className="fixed bottom-[12px] left-1/2 -translate-x-1/2 z-[2000] w-fit"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="tahoe-glass rounded-[24px] p-2 flex items-end gap-1 px-3 pb-2 shadow-2xl relative"
        >
          {APPS.map((app, index) => {
            const nextApp = APPS[index + 1];
            const showDivider = nextApp && (app as any).category !== (nextApp as any).category;
            
            return (
              <React.Fragment key={app.id}>
                {app.id !== 'trash' && (
                  <DockIcon 
                    app={app} 
                    onClick={() => openApp(app.id)} 
                    isOpen={windows.some(w => w.id === app.id)}
                    isMinimized={windows.find(w => w.id === app.id)?.isMinimized}
                    isLaunching={launchingApps.includes(app.id)}
                  />
                )}
                {showDivider && app.id !== 'trash' && nextApp.id !== 'trash' && (
                  <div className="tahoe-dock-divider" />
                )}
              </React.Fragment>
            );
          })}
          <div className="tahoe-dock-divider" />
          <DockIcon 
            ref={trashRef}
            app={APPS.find(a => a.id === 'trash')!} 
            onClick={() => openApp('trash')} 
            isOpen={windows.some(w => w.id === 'trash')}
            isMinimized={windows.find(w => w.id === 'trash')?.isMinimized}
          />
        </motion.div>
      </div>
    </div>
  </>
  );
}
