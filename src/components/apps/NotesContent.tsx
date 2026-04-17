import React from "react";
import { FileText } from "lucide-react";

interface NotesContentProps {
  value: string;
  onChange: (v: string) => void;
}

const NotesContent: React.FC<NotesContentProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-[#fbfbfb]">
      <div className="h-10 border-b border-gray-200 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button className="text-yellow-600 hover:bg-yellow-50 p-1 rounded transition-colors"><FileText size={18} /></button>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">iCloud Notes</span>
        </div>
      </div>
      <textarea 
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-6 text-[14px] text-gray-800 leading-relaxed outline-none bg-transparent resize-none font-sans"
        placeholder="Start writing..."
      />
    </div>
  );
};

export default NotesContent;
