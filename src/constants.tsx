import React from 'react';
import { 
  Folder, 
  Settings, 
  MessageSquare, 
  Music, 
  Image as ImageIcon,
  Trash2,
  Terminal,
  FileText,
  Eye,
  Monitor,
  Compass,
} from "lucide-react";

export const WALLPAPERS = [
{ name: "Tahoe Dark", url: "https://512pixels.net/downloads/macos-wallpapers-6k/26-Tahoe-Dark-6K.png" },
  { name: "Tahoe Blue", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070" },
  { name: "Monterey", url: "https://512pixels.net/wp-content/uploads/2025/06/12-Light-thumbnail.jpg" },
  { name: "Big Sur", url: "https://512pixels.net/wp-content/uploads/2025/06/11-0-Color-Night-thumbnails.jpg" },
  { name: "Catalina", url: "https://512pixels.net/wp-content/uploads/2025/06/10-15-Day-thumb.jpg" },
  { name: "Tahoe Beach Day", url: "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Day-thumb.jpeg" },
  { name: "Ventura", url: "https://512pixels.net/wp-content/uploads/2025/06/13-Ventura-Light-thumb.jpg" },
];

export const INITIAL_MOCK_FILES: Record<string, any[]> = {
  "Recents": [
    { id: "f-1", name: "Presentation.pptx", type: "file", icon: <FileText className="text-orange-400" /> },
    { id: "f-2", name: "Invoice_04.pdf", type: "file", icon: <FileText className="text-red-400" /> },
    { id: "f-3", name: "Screenshot.png", type: "file", icon: <ImageIcon className="text-blue-400" /> },
  ],
  "Applications": [
    { id: "a-1", name: "Safari.app", type: "file", icon: <Compass className="text-blue-400" /> },
    { id: "a-2", name: "Music.app", type: "file", icon: <Music className="text-pink-500" /> },
    { id: "a-3", name: "Terminal.app", type: "file", icon: <Terminal className="text-gray-100" /> },
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

export const APPS = [
  { id: "finder", title: "Finder", icon: <img src="/macos_finder_dark.webp" className="w-24 h-24 object-contain" alt="Finder" />, color: "bg-blue-500/10", category: "system" },
  { id: "notes", title: "Notes", icon: <FileText className="w-9 h-9 text-yellow-600" />, color: "bg-yellow-100", category: "productivity" },
  { id: "music", title: "Music", icon: <Music className="w-9 h-9 text-pink-500" />, color: "bg-pink-500/10", category: "media" },
  { id: "preview", title: "Preview", icon: <img src="/macos_preview.webp" className="w-24 h-24 object-contain" alt="Preview" />, color: "bg-orange-500/10", category: "media" },
  { id: "terminal", title: "Terminal", icon: <img src="/macos_terimal.webp" className="w-24 h-24 object-contain" alt="Terminal" />, color: "bg-black", category: "system_tools" },
  { id: "trash", title: "Trash", icon: <img src="/trash_icon.png" className="w-18 h-18 object-contain" alt="Trash" />, color: "bg-white/10", category: "system" },
];

export const WALLPAPER_PRESETS = [
  { name: "Tahoe Dark", url: "https://512pixels.net/downloads/macos-wallpapers-6k/26-Tahoe-Dark-6K.png" },
  { name: "Tahoe Blue", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070" },
  { name: "Monterey", url: "https://512pixels.net/wp-content/uploads/2025/06/12-Light-thumbnail.jpg" },
  { name: "Big Sur", url: "https://512pixels.net/wp-content/uploads/2025/06/11-0-Color-Night-thumbnails.jpg" },
  { name: "Catalina", url: "https://512pixels.net/wp-content/uploads/2025/06/10-15-Day-thumb.jpg" },
  { name: "Tahoe Beach Day", url: "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Day-thumb.jpeg" },
  { name: "Ventura", url: "https://512pixels.net/wp-content/uploads/2025/06/13-Ventura-Light-thumb.jpg" },
];

export const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)" },
  { name: "Emerald", value: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
  { name: "Deep Space", value: "linear-gradient(to right, #243b55, #141e30)" },
];
