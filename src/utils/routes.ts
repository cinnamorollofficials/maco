import { WindowState } from "../types";

export type ParsedRoute = 
  | { type: 'none' }
  | { type: 'resume' }
  | { type: 'app'; appId: string; config?: any; isMaximized?: boolean };

const FOLDER_MAP: Record<string, string> = {
  project: "Project",
  experience: "Experience",
  certificate: "Certificate",
  documents: "Documents",
  downloads: "Downloads",
  recents: "Recents",
  trash: "Trash",
  applications: "Applications",
  "icloud-drive": "iCloud Drive",
};

/**
 * Returns the URL pathname and query parameter corresponding to the currently active window or view
 */
export function getRouteForWindow(
  activeWindowId: string | null,
  windows: WindowState[],
  isAccessibleViewOpen: boolean
): string {
  if (isAccessibleViewOpen) {
    return "/resume";
  }

  if (!activeWindowId) {
    return "/";
  }

  const activeWin = windows.find(w => w.id === activeWindowId);
  if (!activeWin) {
    return "/";
  }

  const { appId, config, isMaximized } = activeWin;
  const maxParam = isMaximized ? "?maximized=true" : "";

  if (appId === "finder") {
    const folder = config?.initialPath || "Recents";
    const slug = Object.keys(FOLDER_MAP).find(
      key => FOLDER_MAP[key].toLowerCase() === folder.toLowerCase()
    ) || encodeURIComponent(folder.toLowerCase().replace(/\s+/g, '-'));
    return `/finder/${slug}${maxParam}`;
  }

  if (appId === "preview") {
    if (config?.pdfPath?.includes("Portofolio")) {
      return `/preview/portfolio${maxParam}`;
    }
    const titleSlug = encodeURIComponent((config?.title || "doc").toLowerCase().replace(/\s+/g, '-'));
    return `/preview/${titleSlug}${maxParam}`;
  }

  if (appId === "wallpaper_settings") {
    return `/settings/wallpaper${maxParam}`;
  }

  return `/app/${appId}${maxParam}`;
}

/**
 * Parses a browser pathname and search params into an app/folder command with maximize state
 */
export function parseRoute(pathname: string, search?: string): ParsedRoute {
  let searchStr = search || "";
  let cleanPath = pathname;

  if (pathname.includes("?")) {
    const parts = pathname.split("?");
    cleanPath = parts[0];
    if (!searchStr) searchStr = parts[1];
  }

  cleanPath = cleanPath.replace(/\/+$/, "").toLowerCase();

  const searchParams = new URLSearchParams(searchStr);
  const isMaximized = searchParams.get("maximized") === "true" || searchParams.get("max") === "1" || searchParams.get("fullscreen") === "true";

  if (!cleanPath || cleanPath === "") {
    return { type: 'none' };
  }

  if (cleanPath === "/resume") {
    return { type: 'resume' };
  }

  if (cleanPath === "/settings/wallpaper") {
    return { type: 'app', appId: 'wallpaper_settings', isMaximized };
  }

  if (cleanPath === "/preview/portfolio" || cleanPath.startsWith("/preview/")) {
    return { 
      type: 'app', 
      appId: 'preview', 
      config: { title: 'Portofolio Hadi 2026.pdf', pdfPath: '/Portofolio Hadi 2026.pdf' },
      isMaximized
    };
  }

  if (cleanPath.startsWith("/finder/")) {
    const slug = cleanPath.replace("/finder/", "");
    const folderName = FOLDER_MAP[slug] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Recents");
    return {
      type: 'app',
      appId: 'finder',
      config: { initialPath: folderName },
      isMaximized
    };
  }

  if (cleanPath.startsWith("/app/")) {
    const appId = cleanPath.replace("/app/", "");
    return {
      type: 'app',
      appId,
      isMaximized
    };
  }

  // Fallback for short direct paths like /project, /experience, /certificate
  const directSlug = cleanPath.replace("/", "");
  if (FOLDER_MAP[directSlug]) {
    return {
      type: 'app',
      appId: 'finder',
      config: { initialPath: FOLDER_MAP[directSlug] },
      isMaximized
    };
  }

  return { type: 'none' };
}
