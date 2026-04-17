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
  { name: "Dynamic Bloom", url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" },
  { name: "Ventura Peak", url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=2070&auto=format&fit=crop" },
  { name: "Deep Ocean", url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop" },
  { name: "Midnight City", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2070&auto=format&fit=crop" },
  { name: "Autumn Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop" },
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

export const APPS = [
  { id: "finder", title: "Finder", icon: <img src="/folder-icon-macos.png" className="w-8 h-8 object-contain" alt="Finder" />, color: "bg-blue-500/10" },
  { id: "chrome", title: "Safari", icon: <Compass className="text-blue-400" />, color: "bg-white" },
  { id: "music", title: "Music", icon: <Music className="text-pink-500" />, color: "bg-pink-500/10" },
  { id: "notes", title: "Notes", icon: <FileText className="text-yellow-600" />, color: "bg-yellow-100" },
  { id: "messages", title: "Messages", icon: <MessageSquare className="text-green-500" />, color: "bg-green-500/10" },
  { id: "settings", title: "Settings", icon: <Settings className="text-gray-500" />, color: "bg-gray-500/10" },
  { id: "terminal", title: "Terminal", icon: <Terminal className="text-gray-100" />, color: "bg-black" },
  { id: "preview", title: "Preview", icon: <Eye className="text-orange-500" />, color: "bg-orange-500/10" },
  { id: "image_preview", title: "Preview", icon: <ImageIcon className="text-orange-400" />, color: "bg-orange-400/10" },
  { id: "wallpaper_settings", title: "Wallpaper", icon: <Monitor className="text-purple-400" />, color: "bg-purple-400/10" },
  { id: "trash", title: "Trash", icon: <img src="/trash_icon.png" className="w-8 h-8 object-contain" alt="Trash" />, color: "bg-white/10" },
];

export const WALLPAPER_PRESETS = [
  { name: "Tahoe Blue", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070" },
  { name: "Monterey", url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=2070" },
  { name: "Yosemite", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070" },
  { name: "Sunset Loft", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2070" },
];

export const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)" },
  { name: "Emerald", value: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
  { name: "Deep Space", value: "linear-gradient(to right, #243b55, #141e30)" },
];
