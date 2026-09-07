import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, Trash2, FileText } from "lucide-react";

// Types & Constants
import { WindowState, DesktopItem, Note } from "./types";
import { APPS, INITIAL_MOCK_FILES } from "./constants";
import { getRouteForWindow, parseRoute, ParsedRoute } from "./utils/routes";

// Core Components
import BootScreen from "./components/BootScreen";
import TopBar from "./components/TopBar";
import DockIcon from "./components/DockIcon";
import DesktopIcon from "./components/DesktopIcon";
import Window from "./components/Window";
import ContextMenu from "./components/ContextMenu";
import CalendarWidget from "./components/CalendarWidget";
import WeatherWidget from "./components/WeatherWidget";
import HomeIndicator from "./components/HomeIndicator";
import AccessibleViewModal from "./components/AccessibleViewModal";

// Lazy-loaded App Contents & Overlays for Performance
const FinderContent = React.lazy(() => import("./components/apps/FinderContent"));
const SafariContent = React.lazy(() => import("./components/apps/SafariContent"));
const NotesContent = React.lazy(() => import("./components/apps/NotesContent"));
const TerminalContent = React.lazy(() => import("./components/apps/TerminalContent"));
const WallpaperSettingsContent = React.lazy(() => import("./components/apps/WallpaperSettingsContent"));
const PDFPreviewContent = React.lazy(() => import("./components/apps/PDFPreviewContent"));
const ImagePreviewContent = React.lazy(() => import("./components/apps/ImagePreviewContent"));
const MusicContent = React.lazy(() => import("./components/apps/MusicContent"));
const TrashContent = React.lazy(() => import("./components/apps/TrashContent"));
const MockAppContent = React.lazy(() => import("./components/apps/MockAppContent"));
const Spotlight = React.lazy(() => import("./components/Spotlight"));
const Launchpad = React.lazy(() => import("./components/Launchpad"));

const WindowLoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e]/60 backdrop-blur-md">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isAccessibleViewOpen, setIsAccessibleViewOpen] = useState(false);
  const [launchingApps, setLaunchingApps] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState(() => 
    localStorage.getItem('tahoe-wallpaper') || "https://512pixels.net/wp-content/uploads/2025/06/13-Ventura-Light-thumb.jpg"
  );
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ start: { x: number, y: number }, current: { x: number, y: number } } | null>(null);
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('tahoe-notes');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Welcome to Notes',
        content: 'Welcome to Notes!\n\nYou can use this app to jot down your ideas.',
        lastModified: Date.now()
      },
      {
        id: '2',
        title: 'Pro Tips',
        content: '• Double click icons to open apps\n• Drag icons to rearrange them\n• Right click for context menu',
        lastModified: Date.now() - 1000 * 60 * 60
      }
    ];
  });

  const [finderFiles, setFinderFiles] = useState(() => {
    // Migration: v4 loads rich portfolio mock files
    const version = localStorage.getItem('tahoe-v');
    if (version !== '4') {
      localStorage.removeItem('tahoe-files');
      localStorage.setItem('tahoe-v', '4');
    }
    
    const saved = localStorage.getItem('tahoe-files');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_FILES;
  });
  const isSelecting = useRef(false);

  useEffect(() => {
    localStorage.setItem('tahoe-wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('tahoe-notes', JSON.stringify(notes));
    }, 400);
    return () => clearTimeout(handler);
  }, [notes]);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('tahoe-files', JSON.stringify(finderFiles));
    }, 400);
    return () => clearTimeout(handler);
  }, [finderFiles]);

  const trashRef = useRef<HTMLDivElement>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([
    { 
      id: "project-desktop", 
      type: "folder", 
      label: "Project", 
      icon: <img src="/folder-icon-macos.webp" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'Project' })
    },
    { 
      id: "experience-desktop", 
      type: "folder", 
      label: "Experience", 
      icon: <img src="/folder-icon-macos.webp" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'Experience' })
    },
    { 
      id: "certificate-desktop", 
      type: "folder", 
      label: "Certificate", 
      icon: <img src="/folder-icon-macos.webp" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'Certificate' })
    },
    { 
      id: "portfolio-desktop", 
      type: "file", 
      label: "Portofolio Hadi 2026.pdf", 
      icon: <FileText className="w-12 h-12 text-orange-500" />,
      onClick: () => openApp('preview', { title: 'Portofolio Hadi 2026.pdf', pdfPath: '/Portofolio Hadi 2026.pdf' })
    },
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

      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
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

  const renderAppContent = (appWin: WindowState) => {
    const { appId, config } = appWin;
    
    switch (appId) {
      case 'terminal':
        return <TerminalContent files={finderFiles} isFocused={activeWindow === 'terminal'} />;
      case 'safari':
      case 'chrome':
        return <SafariContent />;
      case 'notes':
        return <NotesContent notes={notes} onUpdateNotes={setNotes} />;
      case 'music':
        return <MusicContent />;
      case 'preview':
        return (
          <PDFPreviewContent 
            app={appWin} 
            onStateChange={(state) => {
              setWindows(prev => {
                const win = prev.find(w => w.id === appWin.id);
                if (!win) return prev;
                if (
                  win.config?.page === state.page &&
                  win.config?.zoom === state.zoom &&
                  win.config?.rotation === state.rotation &&
                  win.config?.sidebar === state.sidebar
                ) {
                  return prev;
                }
                return prev.map(w => w.id === appWin.id ? { ...w, config: { ...w.config, ...state } } : w);
              });
            }}
          />
        );
      case 'image_preview':
        return <ImagePreviewContent />;
      case 'finder':
        return (
          <FinderContent 
            onOpenApp={openApp} 
            initialPath={config?.initialPath} 
            files={finderFiles} 
            onMoveToTrash={moveToTrashFromFinder} 
            isFocused={activeWindow === 'finder'}
            trashItems={trashItems}
            onEmptyTrash={() => setTrashItems([])}
            onPutBack={putBackItem}
            onPathChange={(newPath) => {
              setWindows(prev => prev.map(w => w.id === appWin.id ? { ...w, config: { ...w.config, initialPath: newPath } } : w));
              const slug = newPath.toLowerCase().replace(/\s+/g, '-');
              const maxParam = appWin.isMaximized ? '?maximized=true' : '';
              const targetUrl = `/finder/${slug}${maxParam}`;
              const currentUrl = window.location.pathname + window.location.search;
              if (currentUrl !== targetUrl) {
                window.history.replaceState({ activeWindow: appWin.id }, '', targetUrl);
              }
            }}
          />
        );
      case 'trash':
        return (
          <TrashContent 
            items={trashItems}
            onEmptyTrash={() => setTrashItems([])}
            onPutBack={putBackItem}
          />
        );
      case 'wallpaper_settings':
        return <WallpaperSettingsContent current={wallpaper} onSelect={setWallpaper} />;
      default:
        const appInfo = APPS.find(a => a.id === appId);
        return <MockAppContent id={appId} name={appInfo?.title || 'App'} />;
    }
  };

  const openApp = (appId: string, config?: any, isMaximized?: boolean, immediate = false) => {
    if (appId === 'launchpad') {
      setIsLaunchpadOpen(prev => !prev);
      return;
    }
    
    setIsLaunchpadOpen(false);
    setIsSpotlightOpen(false);
    const appInfo = APPS.find(a => a.id === appId);
    if (!appInfo) return;

    // Unique ID if title is provided to allow multiple instances (e.g., Preview)
    const windowId = config?.title ? `${appId}-${config.title}` : appId;
    const windowTitle = config?.title || appInfo.title;

    setWindows(prev => {
      const existingIndex = prev.findIndex(w => w.id === windowId);
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);

      if (existingIndex !== -1) {
        const next = [...prev];
        const existingWindow = next[existingIndex];
        next.splice(existingIndex, 1);
        next.push({ 
          ...existingWindow, 
          isOpen: true,
          isMinimized: false, 
          isMaximized: isMaximized !== undefined ? isMaximized : existingWindow.isMaximized,
          zIndex: maxZ + 1,
          config: config ? { ...existingWindow.config, ...config } : existingWindow.config 
        });
        return next;
      }
      return prev;
    });

    if (windows.some(w => w.id === windowId)) {
      setActiveWindow(windowId);
      return;
    }

    const createWindow = () => {
      setWindows(prev => {
        const alreadyInPrev = prev.findIndex(w => w.id === windowId);
        if (alreadyInPrev !== -1) {
          const next = [...prev];
          const existingWindow = next[alreadyInPrev];
          next.splice(alreadyInPrev, 1);
          next.push({
            ...existingWindow,
            isOpen: true,
            isMinimized: false,
            isMaximized: isMaximized !== undefined ? isMaximized : existingWindow.isMaximized,
            zIndex: Math.max(...prev.map(w => w.zIndex), 0) + 1,
            config: config ? { ...existingWindow.config, ...config } : existingWindow.config
          });
          return next;
        }

        const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
        const cascadeOffset = (prev.length % 8) * 30;
        const initialPosition = {
          x: typeof window !== 'undefined' ? Math.min(Math.max(40, window.innerWidth - 720), 80 + cascadeOffset) : 100,
          y: typeof window !== 'undefined' ? Math.min(Math.max(40, window.innerHeight - 500), 60 + cascadeOffset) : 80,
        };

        return [...prev, { 
          id: windowId, 
          appId: appId,
          title: windowTitle, 
          icon: appInfo.icon, 
          isOpen: true, 
          isMinimized: false, 
          isMaximized: isMaximized ?? false,
          zIndex: maxZ + 1,
          config,
          initialPosition 
        }];
      });
      
      setActiveWindow(windowId);
      setLaunchingApps(prev => prev.filter(id => id !== appId));
    };

    if (immediate) {
      createWindow();
      return;
    }

    if (launchingApps.includes(appId)) return;

    setLaunchingApps(prev => [...prev, appId]);
    setTimeout(createWindow, 800);
  };

  const initialRouteRef = useRef<ParsedRoute>(
    parseRoute(
      typeof window !== 'undefined' ? window.location.pathname : '/',
      typeof window !== 'undefined' ? window.location.search : ''
    )
  );
  const initialRouteExecuted = useRef(false);

  // Execute deep link route once booted
  useEffect(() => {
    if (isBooted && !initialRouteExecuted.current) {
      initialRouteExecuted.current = true;
      const initial = initialRouteRef.current;
      if (initial.type === 'resume') {
        setIsAccessibleViewOpen(true);
      } else if (initial.type === 'app') {
        openApp(initial.appId, initial.config, initial.isMaximized, true);
      }
    }
  }, [isBooted]);

  // Synchronize browser URL with active window or accessible view
  useEffect(() => {
    if (!isBooted || !initialRouteExecuted.current) return;

    // While an initial route app is loading, do not prematurely overwrite the deep link URL with '/'
    if (initialRouteRef.current.type !== 'none' && !activeWindow && !isAccessibleViewOpen) {
      return;
    }

    // Once we have an active window or accessible view, reset initial route ref
    if (activeWindow || isAccessibleViewOpen) {
      initialRouteRef.current = { type: 'none' };
    }

    const targetUrl = getRouteForWindow(activeWindow, windows, isAccessibleViewOpen);
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== targetUrl) {
      const isOnlyParamChange = window.location.pathname === targetUrl.split('?')[0];
      if (isOnlyParamChange) {
        window.history.replaceState({ activeWindow, isAccessibleViewOpen }, '', targetUrl);
      } else {
        window.history.pushState({ activeWindow, isAccessibleViewOpen }, '', targetUrl);
      }
    }
  }, [activeWindow, windows, isAccessibleViewOpen, isBooted]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRoute(window.location.pathname, window.location.search);
      if (parsed.type === 'none') {
        setIsAccessibleViewOpen(false);
        setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
        setActiveWindow(null);
      } else if (parsed.type === 'resume') {
        setIsAccessibleViewOpen(true);
      } else if (parsed.type === 'app') {
        setIsAccessibleViewOpen(false);
        openApp(parsed.appId, parsed.config, parsed.isMaximized, true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [windows]);

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

  const toggleMaximizeApp = (id: string, isMaximized?: boolean) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const next = isMaximized !== undefined ? isMaximized : !w.isMaximized;
        return { ...w, isMaximized: next };
      }
      return w;
    }));
  };

  const [isDockHovered, setIsDockHovered] = useState(false);
  const activeWin = windows.find(w => w.id === activeWindow && !w.isMinimized);
  const isTopBarHidden = !!activeWin?.isMaximized;
  const isDockHidden = isTopBarHidden && !isDockHovered;

  const handleSelectionStart = (e: React.MouseEvent) => {
    // Only allow left click (button 0) for selection marquee to avoid right-click interference
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('.desktop-icon');
    
    if (isInteractive) return;

    setSelection({ 
      start: { x: e.clientX, y: e.clientY }, 
      current: { x: e.clientX, y: e.clientY } 
    });
    setSelectedIds([]);
    setEditingId(null);
  };

  const rafId = useRef<number | null>(null);

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!selection) return;
    const current = { x: e.clientX, y: e.clientY };
    setSelection(prev => prev ? { ...prev, current } : null);

    // If moved more than 5px, it's a marquee selection
    if (Math.abs(current.x - selection.start.x) > 5 || Math.abs(current.y - selection.start.y) > 5) {
      isSelecting.current = true;
    }

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
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
    });
  };

  const handleSelectionEnd = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setSelection(null);
    // Use a small timeout to let the onClick handler run before resetting isSelecting
    setTimeout(() => {
      isSelecting.current = false;
    }, 10);
  };

  useEffect(() => {
    if (selection) {
      const handleGlobalMouseUp = () => {
        handleSelectionEnd();
      };
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [selection]);

  const createFolder = () => {
    const newId = `folder-${Date.now()}`;
    const newFolder: DesktopItem = {
      id: newId,
      type: 'folder',
      label: 'untitled folder',
      icon: <img src="/folder-icon-macos.webp" className="w-14 h-14 object-contain shadow-sm" alt="folder" />,
      onClick: () => openApp('finder', { initialPath: 'untitled folder' })
    };
    setDesktopItems(prev => [...prev, newFolder]);
    setContextMenu(null);
    setEditingId(newId);
    setSelectedIds([newId]);
  };

  const handleRename = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }

    setDesktopItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          label: trimmed,
          onClick: item.type === 'folder'
            ? () => openApp('finder', { initialPath: trimmed })
            : item.onClick
        };
      }
      return item;
    }));

    setFinderFiles(prev => {
      const existing = prev[id] || prev[trimmed] || [];
      return {
        ...prev,
        [trimmed]: existing
      };
    });

    setEditingId(null);
  };

  const goHome = () => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
    setActiveWindow(null);
    setIsLaunchpadOpen(false);
    setIsSpotlightOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  if (!isBooted) {
    return <BootScreen onComplete={() => setIsBooted(true)} />;
  }

  const activeWinObj = windows.find(w => w.id === activeWindow);
  const activeAppTitle = activeWinObj 
    ? activeWinObj.title 
    : (activeWindow ? (APPS.find(a => a.id === activeWindow)?.title || "Finder") : "Finder");

  return (
  <>
    <div 
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out"
      style={{ backgroundImage: wallpaper.startsWith('linear-gradient') ? wallpaper : `url(${wallpaper})` }}
      onClick={(e) => { 
        if (!isSelecting.current) {
          setContextMenu(null); 
          setSelectedIds([]); 
          setEditingId(null); 
        }
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleSelectionStart}
      onMouseMove={handleSelectionMove}
      onMouseUp={handleSelectionEnd}
    >
      <TopBar 
        activeAppTitle={activeAppTitle} 
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onRestart={() => setIsBooted(false)}
        onOpenApp={openApp}
        onOpenAccessibleView={() => setIsAccessibleViewOpen(true)}
        isHidden={isTopBarHidden}
      />

      {/* Widgets Layer - Hidden on Mobile */}
      <div className="hidden md:flex absolute top-[60px] left-[60px] flex-col gap-6 pointer-events-none">
        <CalendarWidget />
        <WeatherWidget />
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-[40px] right-4 bottom-[100px] w-auto max-h-[80vh] flex flex-col flex-wrap-reverse gap-2 content-start justify-items-center p-4 pointer-events-none">
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
        {windows.map((window) => (
          !window.isMinimized && (
            <Window 
              key={window.id} 
              app={window} 
              onClose={() => closeApp(window.id)}
              onMinimize={() => minimizeApp(window.id)}
              onToggleMaximize={() => toggleMaximizeApp(window.id)}
              zIndex={window.zIndex}
              onFocus={() => focusApp(window.id)}
              dragConstraints={desktopRef}
            >
              <React.Suspense fallback={<WindowLoadingFallback />}>
                {renderAppContent(window)}
              </React.Suspense>
            </Window>
          )
        ))}
      </AnimatePresence>

      {/* Launching Animation */}
      <AnimatePresence>
        {launchingApps.map(appId => {
          const targetApp = APPS.find(a => a.id === appId);
          const imgSrc = (targetApp?.icon as any)?.props?.src;

          return (
            <motion.div
              key={appId}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[10000]"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-4">
                {imgSrc ? (
                  <img 
                    src={imgSrc} 
                    className="w-full h-full object-contain animate-bounce" 
                    alt="launching" 
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center animate-bounce text-white">
                    {targetApp?.icon}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Spotlight */}
      <React.Suspense fallback={null}>
        <Spotlight 
          isOpen={isSpotlightOpen} 
          onClose={() => setIsSpotlightOpen(false)} 
          apps={APPS} 
          files={finderFiles}
          notes={notes}
          onOpenApp={openApp} 
        />
      </React.Suspense>

      {/* Launchpad */}
      <React.Suspense fallback={null}>
        <Launchpad
          isOpen={isLaunchpadOpen}
          onClose={() => setIsLaunchpadOpen(false)}
          apps={APPS}
          onOpenApp={openApp}
        />
      </React.Suspense>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)}
          onCreateFolder={createFolder}
          onChangeWallpaper={() => {
            openApp('wallpaper_settings');
            setContextMenu(null);
          }}
        />
      )}

      {/* Dock Area */}
      {isTopBarHidden && (
        <div 
          className="fixed bottom-0 left-0 right-0 h-2.5 z-[2001]"
          onMouseEnter={() => setIsDockHovered(true)}
        />
      )}
      <div 
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
        className={`fixed bottom-[32px] lg:bottom-[12px] left-1/2 -translate-x-1/2 z-[2000] w-fit max-w-[95vw] transition-transform duration-300 ease-in-out ${
          isDockHidden ? "translate-y-[160%] pointer-events-none" : "translate-y-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="tahoe-glass p-2 flex items-end gap-1 px-3 pb-2 rounded-[24px] relative overflow-x-auto no-scrollbar scroll-smooth"
        >
          {APPS.filter(app => !(app as any).hidden).map((app, index) => {
            const nextApp = APPS[index + 1];
            const showDivider = nextApp && (app as any).category !== (nextApp as any).category;
            const targetWin = windows.find(w => w.appId === app.id || w.id === app.id);
            const isOpen = !!targetWin;
            
            return (
              <React.Fragment key={app.id}>
                {app.id !== 'trash' && (
                  <DockIcon 
                    app={app} 
                    onClick={() => {
                      if (app.id === 'launchpad') {
                        setIsLaunchpadOpen(prev => !prev);
                        return;
                      }
                      if (targetWin) {
                        focusApp(targetWin.id);
                      } else {
                        openApp(app.id);
                      }
                    }} 
                    isOpen={isOpen}
                    isMinimized={targetWin?.isMinimized}
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
          {(() => {
            const trashWin = windows.find(w => w.appId === 'trash' || w.id === 'trash');
            return (
              <DockIcon 
                ref={trashRef}
                app={APPS.find(a => a.id === 'trash')!} 
                onClick={() => {
                  if (trashWin) {
                    focusApp(trashWin.id);
                  } else {
                    openApp('trash');
                  }
                }} 
                isOpen={!!trashWin}
                isMinimized={trashWin?.isMinimized}
              />
            );
          })()}
        </motion.div>
      </div>
      {/* Home Indicator for Mobile/Tablet */}
      <HomeIndicator onClick={goHome} />

      {/* Accessible Classic Resume View */}
      <AccessibleViewModal
        isOpen={isAccessibleViewOpen}
        onClose={() => setIsAccessibleViewOpen(false)}
      />
    </div>
  </>
  );
}
