import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, FileText } from "lucide-react";
import { Note } from "../../types";

interface NotesContentProps {
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
}

const NotesContent: React.FC<NotesContentProps> = ({ notes, onUpdateNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateContent = (content: string) => {
    if (!selectedNoteId) return;
    
    // Auto-generate title from first line
    const firstLine = content.split('\n')[0] || 'New Note';
    const title = firstLine.substring(0, 30);

    const updatedNotes = notes.map(n => 
      n.id === selectedNoteId 
        ? { ...n, content, title, lastModified: Date.now() } 
        : n
    );
    onUpdateNotes(updatedNotes);
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastModified: Date.now()
    };
    onUpdateNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = notes.filter(n => n.id !== id);
    onUpdateNotes(updatedNotes);
    if (selectedNoteId === id) {
      setSelectedNoteId(updatedNotes[0]?.id || '');
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white select-none overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-white/5 bg-black/20 flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between shrink-0">
          <div className="relative flex-1 mr-3 group">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-yellow-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white/5 border border-transparent focus:border-yellow-500/50 rounded-md py-1 pl-7 pr-2 text-[12px] outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleAddNote}
            className="p-1.5 hover:bg-white/10 rounded-md text-yellow-500 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
          {notes.length === 0 ? (
            <div className="text-center mt-10 text-white/20 text-[12px]">No Notes</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`group px-3 py-2.5 rounded-lg mb-1 cursor-default transition-all duration-200 ${
                  selectedNoteId === note.id 
                    ? 'bg-yellow-500/20 shadow-inner ring-1 ring-yellow-500/30' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[13px] font-bold truncate pr-2 ${selectedNoteId === note.id ? 'text-yellow-500' : 'text-white/90'}`}>
                    {note.title || 'New Note'}
                  </span>
                  <button 
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-white/40 transition-all`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40 truncate flex-1">
                    {note.content.substring(0, 40) || 'No additional text'}
                  </span>
                  <span className="text-[10px] text-white/20 shrink-0 ml-2">
                    {new Date(note.lastModified).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Editor Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {selectedNote ? (
          <>
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-black/5">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-yellow-500" />
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[2px]">Edit Note</span>
              </div>
              <div className="text-[10px] text-white/20 font-medium">
                Last modified: {new Date(selectedNote.lastModified).toLocaleString()}
              </div>
            </div>
            <textarea 
              autoFocus
              spellCheck={false}
              value={selectedNote.content}
              onChange={(e) => handleUpdateContent(e.target.value)}
              className="flex-1 p-8 text-[15px] font-medium text-white/90 leading-relaxed outline-none bg-transparent resize-none font-sans placeholder-white/10"
              placeholder="Start typing your note here..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <Plus size={32} />
            </div>
            <p className="text-[14px]">Select or create a note</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotesContent;
