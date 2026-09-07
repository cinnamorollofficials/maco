import React, { useState, useEffect, useRef } from "react";
import { 
  Wifi, 
  Search, 
  Volume2, 
  Battery, 
  Sliders, 
  Bluetooth, 
  Sun, 
  Moon, 
  X,
  Sparkles,
  Layers,
  Laptop,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TopBarProps {
  activeAppTitle?: string;
  onOpenSpotlight?: () => void;
  onRestart?: () => void;
  onOpenApp?: (appId: string) => void;
  onOpenAccessibleView?: () => void;
  isHidden?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ 
  activeAppTitle = "Finder", 
  onOpenSpotlight,
  onRestart,
  onOpenApp,
  onOpenAccessibleView,
  isHidden = false
}) => {
  const [time, setTime] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);

  const topBarRef = useRef<HTMLDivElement>(null);
  const isActuallyHidden = isHidden && !isHovered;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target as Node)) {
        setIsAppleMenuOpen(false);
        setIsControlCenterOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Edge Hover Trigger when TopBar is hidden in fullscreen */}
      {isHidden && (
        <div
          className="fixed top-0 left-0 right-0 h-1.5 z-[3001]"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <div 
        ref={topBarRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 right-0 h-[24px] bg-black/60 backdrop-blur-[30px] border-b border-white/10 flex items-center justify-between px-3 z-[3000] text-[13px] text-white font-medium select-none transition-transform duration-300 ease-in-out ${
          isActuallyHidden ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Left Section */}
        <div className="flex items-center gap-1.5 md:gap-3 relative">
          {/* Apple Logo */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsAppleMenuOpen(prev => !prev);
                setIsControlCenterOpen(false);
                setActiveMenu(null);
              }}
              className={`p-1 px-1.5 rounded transition-colors flex items-center justify-center ${isAppleMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
              aria-label="Apple Menu"
            >
              <img 
                src="/apple_logo_white.png" 
                className="w-[14px] h-[14px] object-contain" 
                alt="Apple" 
              />
            </button>

            {/* Apple Menu Dropdown */}
            <AnimatePresence>
              {isAppleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-[28px] w-56 bg-[#1d1d1f]/90 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-1.5 z-[2000] text-[13px] text-white/90"
                >
                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1 hover:bg-blue-600 rounded-md mx-auto block transition-colors"
                  >
                    About This Mac
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-3" />
                  <button
                    onClick={() => {
                      onOpenApp?.('wallpaper_settings');
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1 hover:bg-blue-600 rounded-md mx-auto block transition-colors"
                  >
                    System Settings...
                  </button>
                  <button
                    onClick={() => {
                      onOpenApp?.('finder');
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1 hover:bg-blue-600 rounded-md mx-auto block transition-colors"
                  >
                    App Store...
                  </button>
                  <button
                    onClick={() => {
                      onOpenAccessibleView?.();
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1 hover:bg-blue-600 rounded-md mx-auto block transition-colors text-blue-300 font-medium"
                  >
                    Classic Resume View...
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-3" />
                  <button
                    onClick={() => {
                      onRestart?.();
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1 hover:bg-blue-600 rounded-md mx-auto block transition-colors text-amber-300"
                  >
                    Restart...
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="font-bold whitespace-nowrap px-1">{activeAppTitle}</span>
          
          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center gap-1 text-[13px]">
            {["File", "Edit", "View", "Go", "Window", "Help"].map((menu) => (
              <div key={menu} className="relative">
                <button
                  onClick={() => {
                    setActiveMenu(activeMenu === menu ? null : menu);
                    setIsAppleMenuOpen(false);
                    setIsControlCenterOpen(false);
                  }}
                  className={`px-2 py-0.5 rounded transition-colors text-white/80 hover:text-white ${activeMenu === menu ? 'bg-white/20 text-white' : 'hover:bg-white/10'}`}
                >
                  {menu}
                </button>
                
                {activeMenu === menu && (
                  <div className="absolute left-0 top-[28px] w-48 bg-[#1d1d1f]/90 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-1.5 z-[2000] text-[13px] text-white/90">
                    <div className="px-3.5 py-1 hover:bg-blue-600 rounded-md cursor-default transition-colors">
                      {menu} Actions
                    </div>
                    <div className="px-3.5 py-1 hover:bg-blue-600 rounded-md cursor-default text-white/40">
                      No selection
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onOpenAccessibleView}
            className="px-2 py-0.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white flex items-center gap-1.5 text-[11px]"
            title="Switch to Accessible / Classic Resume View"
          >
            <FileText size={12} className="text-blue-400" />
            <span className="hidden md:inline font-medium">Resume</span>
          </button>

          <button 
            onClick={() => {
              onOpenSpotlight?.();
              setIsAppleMenuOpen(false);
              setIsControlCenterOpen(false);
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white"
            title="Spotlight Search (Cmd + Space)"
          >
            <Search size={14} />
          </button>

          <button
            onClick={() => {
              setIsControlCenterOpen(prev => !prev);
              setIsAppleMenuOpen(false);
              setActiveMenu(null);
            }}
            className={`p-1 rounded transition-colors flex items-center gap-1.5 ${isControlCenterOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'}`}
            title="Control Center"
          >
            <Sliders size={13} className="rotate-90" />
          </button>

          <div className="hidden sm:flex items-center gap-2 opacity-80">
            <Wifi size={14} className={wifiEnabled ? 'text-white' : 'text-white/30'} />
            <Volume2 size={14} />
            <Battery size={16} />
          </div>

          <div className="flex items-center gap-1.5 text-[12px] opacity-85 font-medium ml-1">
            <span className="hidden lg:block">{time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</span>
            <span>{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </div>

      {/* Control Center Popover */}
      <AnimatePresence>
        {isControlCenterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[32px] right-3 w-[300px] bg-[#1e1e1e]/85 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.7)] p-3 z-[3000] text-white select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Grid: Connectivity & Toggles */}
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              {/* Wi-Fi & Bluetooth Pill */}
              <div className="bg-black/25 rounded-xl p-2.5 flex flex-col gap-2 border border-white/5">
                <div 
                  onClick={() => setWifiEnabled(!wifiEnabled)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${wifiEnabled ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'}`}>
                    <Wifi size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold">Wi-Fi</span>
                    <span className="text-[10px] text-white/50">{wifiEnabled ? 'Hadi-5G' : 'Off'}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${bluetoothEnabled ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'}`}>
                    <Bluetooth size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold">Bluetooth</span>
                    <span className="text-[10px] text-white/50">{bluetoothEnabled ? 'AirPods Pro' : 'Off'}</span>
                  </div>
                </div>
              </div>

              {/* Dark Mode & Stage Manager */}
              <div className="flex flex-col gap-2">
                <div 
                  onClick={() => setDarkMode(!darkMode)}
                  className="bg-black/25 rounded-xl p-2.5 flex items-center gap-2.5 border border-white/5 cursor-pointer flex-1"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'}`}>
                    <Moon size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold leading-tight">Dark Mode</span>
                    <span className="text-[10px] text-white/50">{darkMode ? 'On' : 'Off'}</span>
                  </div>
                </div>

                <div 
                  onClick={() => onOpenApp?.('wallpaper_settings')}
                  className="bg-black/25 rounded-xl p-2.5 flex items-center gap-2.5 border border-white/5 cursor-pointer flex-1"
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                    <Sparkles size={14} />
                  </div>
                  <span className="text-[12px] font-semibold">Wallpaper</span>
                </div>
              </div>
            </div>

            {/* Sliders: Display & Sound */}
            <div className="bg-black/25 rounded-xl p-3 border border-white/5 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-white/70">
                  <span className="flex items-center gap-1.5"><Sun size={12} /> Display</span>
                  <span>{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={brightness} 
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-white/70">
                  <span className="flex items-center gap-1.5"><Volume2 size={12} /> Sound</span>
                  <span>{volume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About This Mac Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[460px] bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden text-white select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="h-9 px-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center"
                >
                  <X size={8} className="text-black/60" />
                </button>
                <span className="text-[12px] font-semibold text-white/80">About This Mac</span>
                <div className="w-3" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl mb-4 flex items-center justify-center">
                  <Laptop size={44} className="text-white" />
                </div>

                <h2 className="text-xl font-bold tracking-tight">macOS Tahoe Web Clone</h2>
                <p className="text-[12px] text-white/50 mb-6">Version 15.0 Portfolio Edition</p>

                <div className="w-full bg-white/5 rounded-xl p-4 text-left text-[12px] space-y-2 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-white/40">Model</span>
                    <span className="font-semibold">MacBook Pro 16&Prime; (Virtual)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Engineer</span>
                    <span className="font-semibold text-blue-400">Hadi Gunawan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Role</span>
                    <span className="font-semibold">Senior Frontend / Fullstack</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Tech Stack</span>
                    <span className="font-semibold">React 19 • Vite • Tailwind v4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Storage</span>
                    <span className="font-semibold">512 GB Virtual Drive</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowAboutModal(false);
                      onOpenApp?.('wallpaper_settings');
                    }}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    System Settings...
                  </button>
                  <button
                    onClick={() => setShowAboutModal(false)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
