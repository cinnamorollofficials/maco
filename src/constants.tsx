import React from 'react';
import { 
  Monitor, 
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
  "Recents": [
    { id: "rec-1", name: "Portofolio Hadi 2026.pdf", type: "file", icon: { identifier: "pdf", color: "text-red-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "rec-2", name: "Maco - macOS Web OS.url", type: "file", icon: { identifier: "globe", color: "text-blue-400" }, url: "https://github.com/cinnamorollofficials/maco" },
    { id: "rec-3", name: "Career_Milestones.pdf", type: "file", icon: { identifier: "pdf", color: "text-red-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "rec-4", name: "About_Me.txt", type: "file", icon: { identifier: "file-text", color: "text-yellow-400" }, content: "Halo! Saya Hadi Gunawan, Senior Frontend / Fullstack Engineer yang berdedikasi membangun aplikasi web modern, cepat, dan berestetika tinggi." },
  ],
  "Applications": [
    { id: "app-safari", name: "safari.app", type: "file", icon: { identifier: "compass", color: "text-blue-400" } },
    { id: "app-terminal", name: "terminal.app", type: "file", icon: { identifier: "terminal", color: "text-emerald-400" } },
    { id: "app-notes", name: "notes.app", type: "file", icon: { identifier: "file-text", color: "text-yellow-400" } },
    { id: "app-music", name: "music.app", type: "file", icon: { identifier: "music", color: "text-pink-400" } },
  ],
  "Documents": [
    { id: "doc-portfolio", name: "Portofolio Hadi 2026.pdf", type: "file", icon: { identifier: "pdf", color: "text-red-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "doc-about", name: "About_Me.txt", type: "file", icon: { identifier: "file-text", color: "text-yellow-400" }, content: "Hadi Gunawan - Web Developer & Software Engineer.\nFokus pada React, TypeScript, Node.js, Next.js, dan modern UI/UX design." },
    { id: "doc-resume", name: "Resume_Summary.txt", type: "file", icon: { identifier: "file-text", color: "text-blue-400" }, content: "Pengalaman 5+ tahun dalam pengembangan Web & Cloud Native Apps." },
  ],
  "Downloads": [
    { id: "dl-1", name: "Portofolio Hadi 2026.pdf", type: "file", icon: { identifier: "pdf", color: "text-red-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
  ],
  "iCloud Drive": [
    { id: "icloud-1", name: "Projects_Backup.zip", type: "file", icon: { identifier: "file-text", color: "text-gray-400" } },
  ],
  "Project": [
    { id: "proj-1", name: "Maco - macOS Web OS.url", type: "file", icon: { identifier: "globe", color: "text-blue-400" }, url: "https://github.com/cinnamorollofficials/maco" },
    { id: "proj-2", name: "E-Commerce Microfrontend.url", type: "file", icon: { identifier: "globe", color: "text-emerald-400" }, url: "https://github.com" },
    { id: "proj-3", name: "AI Agent Orchestrator.url", type: "file", icon: { identifier: "code", color: "text-purple-400" }, url: "https://github.com" },
    { id: "proj-4", name: "Design System Tahoe.url", type: "file", icon: { identifier: "code", color: "text-pink-400" }, url: "https://github.com" },
    { id: "proj-readme", name: "Projects_Overview.txt", type: "file", icon: { identifier: "file-text", color: "text-yellow-400" }, content: "Daftar proyek unggulan:\n1. Maco - macOS Web Desktop\n2. E-Commerce Microfrontend Platform\n3. AI Agent Orchestrator Pipeline\n4. Tahoe UI Glassmorphic Design System" },
  ],
  "Experience": [
    { id: "exp-1", name: "Senior_Frontend_Engineer.txt", type: "file", icon: { identifier: "briefcase", color: "text-blue-400" }, content: "Senior Frontend Engineer (2023 - Present)\n• Mengembangkan arsitektur micro-frontend berskala besar.\n• Optimasi performa web core vitals dan CI/CD automation." },
    { id: "exp-2", name: "Fullstack_Developer.txt", type: "file", icon: { identifier: "briefcase", color: "text-indigo-400" }, content: "Fullstack Developer (2021 - 2023)\n• Membangun RESTful & GraphQL API dengan Node.js dan TypeScript.\n• Desain database PostgreSQL dan integrasi cloud storage." },
    { id: "exp-3", name: "Frontend_Specialist.txt", type: "file", icon: { identifier: "briefcase", color: "text-sky-400" }, content: "Frontend Specialist (2019 - 2021)\n• Implementasi UI/UX design pixel-perfect dengan React & Vue.\n• Integrasi state management dan unit testing." },
    { id: "exp-pdf", name: "Career_Milestones.pdf", type: "file", icon: { identifier: "pdf", color: "text-red-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
  ],
  "Certificate": [
    { id: "cert-1", name: "AWS_Certified_Architect.pdf", type: "file", icon: { identifier: "award", color: "text-amber-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "cert-2", name: "Meta_Frontend_Professional.pdf", type: "file", icon: { identifier: "award", color: "text-blue-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "cert-3", name: "FullStack_Specialist_Certificate.pdf", type: "file", icon: { identifier: "award", color: "text-emerald-400" }, pdfPath: "/Portofolio Hadi 2026.pdf" },
    { id: "cert-badge", name: "Certified_Developer_Badge.png", type: "file", icon: { identifier: "image", color: "text-purple-400" } },
  ],
};

export const APPS = [
  { id: "launchpad", title: "Launchpad", icon: <img src="/macos_launchpad.png?v=2" className="w-12 h-12 object-contain" alt="Launchpad" draggable="false" />, color: "bg-white/10", category: "system" },
  { id: "finder", title: "Finder", icon: <img src="/macos_finder_dark.webp?v=2" className="w-12 h-12 object-contain" alt="Finder" draggable="false" />, color: "bg-blue-500/10", category: "system" },
  { id: "safari", title: "Safari", icon: <img src="/macos_safari.png?v=2" className="w-12 h-12 object-contain" alt="Safari" draggable="false" />, color: "bg-blue-500/20", category: "productivity" },
  { id: "notes", title: "Notes", icon: <img src="/macos_notes.webp?v=2" className="w-12 h-12 object-contain" alt="Notes" draggable="false" />, color: "bg-yellow-100", category: "productivity" },
  { id: "music", title: "Music", icon: <img src="/macos_music.webp?v=2" className="w-12 h-12 object-contain" alt="Music" draggable="false" />, color: "bg-pink-500/10", category: "media" },
  { id: "preview", title: "Preview", icon: <img src="/macos_preview.webp?v=2" className="w-12 h-12 object-contain" alt="Preview" draggable="false" />, color: "bg-orange-500/10", category: "media" },
  { id: "terminal", title: "Terminal", icon: <img src="/macos_terminal.webp?v=2" className="w-12 h-12 object-contain" alt="Terminal" draggable="false" />, color: "bg-black", category: "system_tools" },
  { id: "trash", title: "Trash", icon: <img src="/trash_icon.png?v=2" className="w-12 h-12 object-contain" alt="Trash" draggable="false" />, color: "bg-white/10", category: "system" },
  { id: "wallpaper_settings", title: "Wallpaper Settings", icon: <Monitor className="text-blue-400" />, color: "bg-blue-500/10", category: "system", hidden: true },
];

export const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)" },
  { name: "Emerald", value: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
  { name: "Deep Space", value: "linear-gradient(to right, #243b55, #141e30)" },
];
