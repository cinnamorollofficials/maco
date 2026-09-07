import React from 'react';
import { 
  Monitor, 
  Compass, 
} from "lucide-react";

export const WALLPAPER_PRESETS = [
  { name: "Ventura", url: "https://512pixels.net/wp-content/uploads/2025/06/13-Ventura-Light-thumb.jpg" },
  { name: "Tahoe Dark", url: "https://512pixels.net/downloads/macos-wallpapers-6k/26-Tahoe-Dark-6K.png" },
  { name: "Tahoe Blue", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070" },
  { name: "Monterey", url: "https://512pixels.net/wp-content/uploads/2025/06/12-Light-thumbnail.jpg" },
  { name: "Big Sur", url: "https://512pixels.net/wp-content/uploads/2025/06/11-0-Color-Night-thumbnails.jpg" },
  { name: "Catalina", url: "https://512pixels.net/wp-content/uploads/2025/06/10-15-Day-thumb.jpg" },
  { name: "Tahoe Beach Day", url: "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Day-thumb.jpeg" },
];

export const WALLPAPERS = WALLPAPER_PRESETS;

export const INITIAL_MOCK_FILES: Record<string, any[]> = {
  "Recents": [],
  "Applications": [],
  "Documents": [],
  "Downloads": [],
  "iCloud Drive": [],
  "Project": [],
  "Experience": [],
  "Certificate": [],
};

export const APPS = [
  { id: "launchpad", title: "Launchpad", icon: <img src="/macos_launchpad.png" className="w-12 h-12 object-contain" alt="Launchpad" draggable="false" />, color: "bg-white/10", category: "system" },
  { id: "finder", title: "Finder", icon: <img src="/macos_finder_dark.webp" className="w-12 h-12 object-contain" alt="Finder" draggable="false" />, color: "bg-blue-500/10", category: "system" },
  { 
    id: "safari", 
    title: "Safari", 
    icon: (
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-md border border-white/20">
        <Compass className="w-7 h-7 text-white stroke-[2]" />
      </div>
    ), 
    color: "bg-blue-500/20", 
    category: "productivity" 
  },
  { id: "notes", title: "Notes", icon: <img src="/macos_notes.webp" className="w-10 h-10 object-contain" alt="Notes" draggable="false" />, color: "bg-yellow-100", category: "productivity" },
  { id: "music", title: "Music", icon: <img src="/macos_music.webp" className="w-12 h-12 object-contain" alt="Music" draggable="false" />, color: "bg-pink-500/10", category: "media" },
  { id: "preview", title: "Preview", icon: <img src="/macos_preview.webp" className="w-12 h-12 object-contain" alt="Preview" draggable="false" />, color: "bg-orange-500/10", category: "media" },
  { id: "terminal", title: "Terminal", icon: <img src="/macos_terminal.webp" className="w-12 h-12 object-contain" alt="Terminal" draggable="false" />, color: "bg-black", category: "system_tools" },
  { id: "trash", title: "Trash", icon: <img src="/trash_icon.png" className="w-12 h-12 object-contain" alt="Trash" draggable="false" />, color: "bg-white/10", category: "system" },
  { id: "wallpaper_settings", title: "Wallpaper Settings", icon: <Monitor className="text-blue-400" />, color: "bg-blue-500/10", category: "system", hidden: true },
];

export const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)" },
  { name: "Emerald", value: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
  { name: "Deep Space", value: "linear-gradient(to right, #243b55, #141e30)" },
];
