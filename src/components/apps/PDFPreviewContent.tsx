import React from "react";
import { Sidebar, ChevronLeft, ChevronRight, ZoomOut, ZoomIn, RotateCw, Share, Download } from "lucide-react";
import { WindowState } from "../../types";

interface PDFPreviewContentProps {
  app?: WindowState;
}

const PDFPreviewContent: React.FC<PDFPreviewContentProps> = ({ app }) => {
  const pdfPath = app?.config?.pdfPath;
  // FIX: encode path so filenames with spaces (e.g. "Portofolio Hadi 2026.pdf") work correctly
  const encodedPdfPath = pdfPath
    ? encodeURI(pdfPath).replace(/#/g, "%23") + "#toolbar=0&navpanes=0"
    : null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-10 bg-[#2d2d2d] border-b border-white/5 flex items-center justify-between px-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/50"><Sidebar size={14} /></button>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-[12px]">
            <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={14} /></button>
            <span className="bg-black/20 px-2 py-0.5 rounded text-white/60">1 / 1</span>
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
          {pdfPath && (
            <a
              href={pdfPath}
              download
              className="p-1.5 hover:bg-white/10 rounded text-white/50 flex items-center"
              title="Download PDF"
            >
              <Download size={14} />
            </a>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50"><Share size={14} /></button>
        </div>
      </div>

      {/* PDF Viewer — works on both desktop and mobile */}
      <div className="flex-1 overflow-auto bg-[#1a1a1a] flex flex-col items-center">
        {encodedPdfPath ? (
          <>
            {/* Primary: native iframe embed */}
            <iframe
              src={encodedPdfPath}
              className="w-full h-full border-none"
              title={app?.config?.title || "PDF Preview"}
            />
            {/* Fallback link shown below on browsers that block iframe PDF rendering */}
            <div className="shrink-0 py-3 text-center text-white/30 text-[11px] select-none">
              Tidak bisa melihat PDF?{" "}
              <a
                href={pdfPath!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                Buka di tab baru
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
            <Sidebar size={40} className="opacity-30" />
            <p className="text-sm">Tidak ada file PDF yang dipilih.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewContent;
