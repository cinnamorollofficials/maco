import React, { useState, useEffect, useRef } from "react";
import { Sidebar, ChevronLeft, ChevronRight, ZoomOut, ZoomIn, RotateCw, Share, Download, Loader2 } from "lucide-react";
import { WindowState } from "../../types";
import * as pdfjsLib from "pdfjs-dist";

// Configure worker for PDF.js via URL constructor
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFPreviewContentProps {
  app?: WindowState;
}

interface PageItemProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  rotation: number;
  onVisible?: (pageNum: number) => void;
}

const PDFPageItem: React.FC<PageItemProps> = ({ pdfDoc, pageNum, scale, rotation, onVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(pageNum);
        if (!isMounted || !canvasRef.current) return;

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        if (isMounted) setIsRendered(true);
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(`Error rendering page ${pageNum}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale, rotation]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            onVisible(pageNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNum, onVisible]);

  return (
    <div
      ref={containerRef}
      id={`pdf-page-${pageNum}`}
      className="relative flex flex-col items-center my-4"
    >
      <div className="relative bg-white shadow-2xl rounded-xs overflow-hidden transition-all duration-200">
        {!isRendered && (
          <div className="absolute inset-0 bg-neutral-900/10 flex items-center justify-center min-w-[300px] min-h-[400px]">
            <Loader2 size={24} className="animate-spin text-white/30" />
          </div>
        )}
        <canvas ref={canvasRef} className="block select-none" />
      </div>
      <div className="text-[11px] text-white/30 mt-1 select-none font-medium">
        Halaman {pageNum}
      </div>
    </div>
  );
};

const PDFPreviewContent: React.FC<PDFPreviewContentProps> = ({ app }) => {
  const pdfPath = app?.config?.pdfPath || "/Portofolio Hadi 2026.pdf";
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfPath,
          cMapUrl: "https://unpkg.com/pdfjs-dist@" + pdfjsLib.version + "/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Failed to load PDF:", err);
          setError("Gagal memuat dokumen PDF.");
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfPath]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-10 bg-[#2d2d2d] border-b border-white/5 flex items-center justify-between px-4 shrink-0 shadow-lg select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className={`p-1 rounded transition-colors ${
                isSidebarOpen ? "bg-white/15 text-white" : "hover:bg-white/10 text-white/50"
              }`}
              title="Toggle Sidebar"
            >
              <Sidebar size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-[12px]">
            <button
              className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="bg-black/20 px-2 py-0.5 rounded text-white/60 font-mono">
              {currentPage} / {numPages}
            </span>
            <button
              className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              disabled={currentPage >= numPages}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button className="p-1 hover:bg-white/10 rounded text-white/50" title="Perkecil">
              <ZoomOut size={14} />
            </button>
            <div className="w-px h-3 bg-white/5 mx-1" />
            <button className="p-1 hover:bg-white/10 rounded text-white/50" title="Perbesar">
              <ZoomIn size={14} />
            </button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50" title="Putar">
            <RotateCw size={14} />
          </button>
          {pdfPath && (
            <a
              href={pdfPath}
              download
              className="p-1.5 hover:bg-white/10 rounded text-white/50 flex items-center"
              title="Unduh PDF"
            >
              <Download size={14} />
            </a>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50" title="Bagikan">
            <Share size={14} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Pages Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-[#181818] p-6 flex flex-col items-center"
        >
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 gap-3">
              <Loader2 size={32} className="animate-spin text-blue-400" />
              <p className="text-xs">Memuat dokumen PDF...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 gap-3">
              <Sidebar size={36} className="opacity-30" />
              <p className="text-sm text-red-400">{error}</p>
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 underline hover:text-blue-300 mt-2"
              >
                Buka PDF di tab baru
              </a>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <PDFPageItem
                  key={pageNum}
                  pdfDoc={pdfDoc}
                  pageNum={pageNum}
                  scale={scale}
                  rotation={rotation}
                  onVisible={(page) => setCurrentPage(page)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewContent;
