import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command, FileText, StickyNote } from "lucide-react";

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  apps: any[];
  files?: Record<string, any[]>;
  notes?: any[];
  onOpenApp: (appId: string, config?: any) => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Applications' | 'Files' | 'Notes';
  icon: React.ReactNode;
  onSelect: () => void;
}

const Spotlight: React.FC<SpotlightProps> = ({ 
  isOpen, 
  onClose, 
  apps, 
  files = {}, 
  notes = [], 
  onOpenApp 
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results: SearchResultItem[] = [];
  const q = query.trim().toLowerCase();

  if (q) {
    // 1. Apps
    apps
      .filter(app => !app.hidden && app.title.toLowerCase().includes(q))
      .forEach(app => {
        results.push({
          id: `app-${app.id}`,
          title: app.title,
          subtitle: 'Application',
          category: 'Applications',
          icon: app.icon,
          onSelect: () => onOpenApp(app.id),
        });
      });

    // 2. Files across Finder folders
    Object.entries(files).forEach(([folder, items]) => {
      const fileList = Array.isArray(items) ? items : [];
      fileList.forEach(file => {
        const name = file.name || file.label || '';
        if (name.toLowerCase().includes(q)) {
          results.push({
            id: `file-${folder}-${file.id || name}`,
            title: name,
            subtitle: `Finder • ${folder}`,
            category: 'Files',
            icon: <FileText className="w-5 h-5 text-blue-400" />,
            onSelect: () => {
              const lower = name.toLowerCase();
              if (lower.endsWith('.pdf')) {
                onOpenApp('preview', { title: name, pdfPath: file.pdfPath || `/${name}` });
              } else if (lower.endsWith('.png') || lower.endsWith('.jpg')) {
                onOpenApp('image_preview');
              } else if (lower.endsWith('.url')) {
                if (file.url) window.open(file.url, '_blank');
                else onOpenApp('safari');
              } else if (lower.endsWith('.txt')) {
                onOpenApp('notes');
              } else {
                onOpenApp('finder', { initialPath: folder });
              }
            },
          });
        }
      });
    });

    // 3. Notes
    notes
      .filter(n => (n.title && n.title.toLowerCase().includes(q)) || (n.content && n.content.toLowerCase().includes(q)))
      .forEach(n => {
        results.push({
          id: `note-${n.id}`,
          title: n.title || 'Untitled Note',
          subtitle: (n.content || '').slice(0, 40) || 'Note text',
          category: 'Notes',
          icon: <StickyNote className="w-5 h-5 text-yellow-400" />,
          onSelect: () => onOpenApp('notes'),
        });
      });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    }
    if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    }
    if (e.key === "Enter" && results.length > 0) {
      results[selectedIndex]?.onSelect();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-start justify-center pt-[15vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[600px] bg-[#1e1e1e]/85 backdrop-blur-[35px] border border-white/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10 gap-3">
              <Search className="text-white/40" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent border-none outline-none text-white text-2xl font-light placeholder:text-white/20"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="bg-white/10 px-2 py-1 rounded text-white/40 text-xs flex items-center gap-1">
                <Command size={10} />
                <span>Space</span>
              </div>
            </div>

            {query.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-default transition-colors ${
                        index === selectedIndex ? "bg-blue-600 text-white" : "hover:bg-white/5 text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 [&_img]:w-full [&_img]:h-full [&_svg]:w-5 [&_svg]:h-5">
                          {item.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-medium truncate">{item.title}</span>
                          {item.subtitle && (
                            <span className={`text-[11px] truncate ${index === selectedIndex ? 'text-white/70' : 'text-white/40'}`}>
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider shrink-0 ml-2 ${
                        index === selectedIndex ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-white/30 text-sm">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
            
            <div className="px-4 py-2 border-t border-white/10 bg-black/10 flex items-center justify-between">
               <span className="text-[10px] text-white/40 tracking-tight">Search apps, documents, projects & notes</span>
               <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 opacity-40">
                    <span className="text-[10px] text-white">Esc to cancel</span>
                 </div>
               </div>
            </div>
          </motion.div>
          <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;
