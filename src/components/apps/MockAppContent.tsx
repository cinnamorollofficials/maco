import React from "react";
import { FileText, Image as ImageIcon } from "lucide-react";

interface MockAppContentProps {
  id: string;
  name: string;
}

const MockAppContent: React.FC<MockAppContentProps> = ({ id, name }) => {
  return (
    <div className="flex h-full overflow-hidden">
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

export default MockAppContent;
