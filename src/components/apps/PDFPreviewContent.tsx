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

interface ThumbnailItemProps {
  pdfDoc: any;
  pageNum: number;
  isActive: boolean;
  onClick: () => void;
}

const PDFThumbnailItem: React.FC<ThumbnailItemProps> = ({
  pdfDoc,
  pageNum,
  isActive,
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let isMounted = true;

    const renderThumbnail = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!isMounted || !canvasRef.current) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const thumbScale = 110 / unscaledViewport.width;
        const viewport = page.getViewport({ scale: thumbScale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        if (isMounted) setIsRendered(true);
      } catch (err: any) {
        // ignore cancel
      }
    };

    renderThumbnail();

    return () => {
      isMounted = false;
    };
  }, [pdfDoc, pageNum]);

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center p-2 rounded-lg transition-all text-center w-full ${
        isActive
          ? "bg-blue-600/20 text-white"
          : "hover:bg-white/5 text-white/50 hover:text-white/80"
      }`}
      title={`Loncat ke Halaman ${pageNum}`}
    >
      <div
        className={`relative bg-white rounded-xs shadow-md overflow-hidden transition-all duration-150 ${
          isActive
            ? "ring-2 ring-blue-500 shadow-blue-500/20"
            : "group-hover:ring-1 group-hover:ring-white/20"
        }`}
      >
        {!isRendered && (
          <div className="w-[110px] h-[140px] bg-neutral-800 flex items-center justify-center">
            <Loader2 size={16} className="animate-spin text-white/20" />
          </div>
        )}
        <canvas ref={canvasRef} className="block" />
      </div>
      <span className="text-[11px] font-medium mt-1.5 font-mono">{pageNum}</span>
    </button>
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

  const [isEditingPage, setIsEditingPage] = useState<boolean>(false);
  const [pageInputVal, setPageInputVal] = useState<string>("1");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToPage = (pageNum: number) => {
    const target = Math.max(1, Math.min(numPages, pageNum));
    const el = document.getElementById(`pdf-page-${target}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(target);
      setPageInputVal(String(target));
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputVal, 10);
    if (!isNaN(parsed)) {
      scrollToPage(parsed);
    }
    setIsEditingPage(false);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(2.5, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, Math.round((prev - 0.25) * 100) / 100));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        scrollToPage(currentPage + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        scrollToPage(currentPage - 1);
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleResetZoom();
      } else if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey) {
        handleRotate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, scale, rotation]);

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
          setPageInputVal("1");
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
              title="Toggle Panel Thumbnail"
            >
              <Sidebar size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <button
              onClick={() => scrollToPage(currentPage - 1)}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              disabled={currentPage <= 1}
              title="Halaman Sebelumnya (←)"
            >
              <ChevronLeft size={14} />
            </button>
            
            {isEditingPage ? (
              <form onSubmit={handlePageInputSubmit} className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageInputVal}
                  autoFocus
                  onChange={(e) => setPageInputVal(e.target.value)}
                  onBlur={() => {
                    const parsed = parseInt(pageInputVal, 10);
                    if (!isNaN(parsed)) scrollToPage(parsed);
                    setIsEditingPage(false);
                  }}
                  className="w-9 bg-black/40 text-center text-white text-[12px] font-mono rounded px-1 py-0.5 border border-blue-500/50 outline-none"
                />
                <span className="text-white/40 font-mono ml-1">/ {numPages}</span>
              </form>
            ) : (
              <button
                onClick={() => {
                  setPageInputVal(String(currentPage));
                  setIsEditingPage(true);
                }}
                className="bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded text-white/70 hover:text-white font-mono transition-colors cursor-text"
                title="Klik untuk lompat halaman"
              >
                {currentPage} / {numPages}
              </button>
            )}

            <button
              onClick={() => scrollToPage(currentPage + 1)}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              disabled={currentPage >= numPages}
              title="Halaman Selanjutnya (→)"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Perkecil (-)"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-[11px] font-mono text-white/60 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
              title="Reset ke 100% (Tekan 0)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 2.5}
              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Perbesar (+)"
            >
              <ZoomIn size={14} />
            </button>
          </div>
          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
            title="Putar 90° Searah Jarum Jam (R)"
          >
            <RotateCw size={14} />
          </button>
          {pdfPath && (
            <a
              href={pdfPath}
              download
              className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors flex items-center"
              title="Unduh PDF"
            >
              <Download size={14} />
            </a>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors" title="Bagikan">
            <Share size={14} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Drawer */}
        {isSidebarOpen && pdfDoc && (
          <aside className="w-40 bg-[#242424] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto p-2 gap-2 select-none animate-in fade-in slide-in-from-left duration-150">
            <div className="text-[10px] font-bold text-white/40 px-2 py-1 tracking-wider uppercase">
              Thumbnail ({numPages})
            </div>
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <PDFThumbnailItem
                  key={pageNum}
                  pdfDoc={pdfDoc}
                  pageNum={pageNum}
                  isActive={currentPage === pageNum}
                  onClick={() => scrollToPage(pageNum)}
                />
              ))}
            </div>
          </aside>
        )}

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
