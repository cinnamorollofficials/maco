import React from "react";
import { Sidebar, ChevronLeft, ChevronRight, ZoomOut, ZoomIn, RotateCw, Share } from "lucide-react";
import { WindowState } from "../../types";

interface PDFPreviewContentProps {
  app?: WindowState;
}

const PDFPreviewContent: React.FC<PDFPreviewContentProps> = ({ app }) => {
  const pdfPath = app?.config?.pdfPath;
  // Add toolbar=0 to the PDF path to hide browser native controls and make it look cleaner
  const cleanPdfPath = pdfPath ? `${pdfPath}#toolbar=0&navpanes=0` : null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="h-10 bg-[#2d2d2d] border-b border-white/5 flex items-center justify-between px-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/50"><Sidebar size={14} /></button>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-[12px]">
            <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={14} /></button>
            <span className="bg-black/20 px-2 py-0.5 rounded text-white/60">1 / {pdfPath ? '1' : '12'}</span>
            <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={14} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/50"><ZoomOut size={14} /></button>
            <div className="w-px h-3 bg-white/5 mx-1" />
            <button className="p-1 hover:bg-white/10 rounded text-white/50"><ZoomIn size={14} /></button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50"><RotateCw size={14} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50"><Share size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-[#1a1a1a] flex justify-center">
        {cleanPdfPath ? (
          <iframe 
            src={cleanPdfPath} 
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        ) : (
          <div className="w-[500px] h-[700px] bg-white shadow-2xl flex flex-col p-12 text-gray-800 font-serif relative shrink-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <h1 className="text-3xl font-bold mb-2">JOSHUA GUNAWAN</h1>
            <p className="text-blue-600 font-sans text-sm mb-8 tracking-widest uppercase">Senior Software Engineer</p>
            
            <div className="space-y-6 overflow-hidden">
              <section>
                <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Experience</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between font-sans text-[12px] font-bold">
                      <span>Tech Giant Corp</span>
                      <span>2020 - Present</span>
                    </div>
                    <p className="text-[11px] mt-1 italic">Lead Frontend Developer</p>
                    <ul className="list-disc list-inside text-[10px] mt-2 space-y-1 text-gray-600 leading-relaxed">
                      <li>Architected high-performance macOS-style web interfaces using React and Framer Motion.</li>
                      <li>Optimized rendering performance by 40% through advanced memoization techniques.</li>
                      <li>Led a team of 12 engineers in developing a scalable design system.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                <div className="font-sans text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>University of Technology</span>
                    <span>2014 - 2018</span>
                  </div>
                  <p>B.S. in Computer Science, Magna Cum Laude</p>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewContent;
