import { WindowState } from "../types";

export type ParsedRoute = 
  | { type: 'none' }
  | { type: 'resume' }
  | { type: 'app'; appId: string; config?: any };

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
 * Returns the URL pathname corresponding to the currently active window or view
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

  const { appId, config } = activeWin;

  if (appId === "finder") {
    const folder = config?.initialPath || "Recents";
    const slug = Object.keys(FOLDER_MAP).find(
      key => FOLDER_MAP[key].toLowerCase() === folder.toLowerCase()
    ) || encodeURIComponent(folder.toLowerCase().replace(/\s+/g, '-'));
    return `/finder/${slug}`;
  }

  if (appId === "preview") {
    if (config?.pdfPath?.includes("Portofolio")) {
      return "/preview/portfolio";
    }
    const titleSlug = encodeURIComponent((config?.title || "doc").toLowerCase().replace(/\s+/g, '-'));
    return `/preview/${titleSlug}`;
  }

  if (appId === "wallpaper_settings") {
    return "/settings/wallpaper";
  }

  return `/app/${appId}`;
}

/**
 * Parses a browser pathname into an app/folder command
 */
export function parseRoute(pathname: string): ParsedRoute {
  const cleanPath = pathname.replace(/\/+$/, "").toLowerCase();

  if (!cleanPath || cleanPath === "") {
    return { type: 'none' };
  }

  if (cleanPath === "/resume") {
    return { type: 'resume' };
  }

  if (cleanPath === "/settings/wallpaper") {
    return { type: 'app', appId: 'wallpaper_settings' };
  }

  if (cleanPath === "/preview/portfolio" || cleanPath.startsWith("/preview/")) {
    return { 
      type: 'app', 
      appId: 'preview', 
      config: { title: 'Portofolio Hadi 2026.pdf', pdfPath: '/Portofolio Hadi 2026.pdf' } 
    };
  }

  if (cleanPath.startsWith("/finder/")) {
    const slug = cleanPath.replace("/finder/", "");
    const folderName = FOLDER_MAP[slug] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Recents");
    return {
      type: 'app',
      appId: 'finder',
      config: { initialPath: folderName },
    };
  }

  if (cleanPath.startsWith("/app/")) {
    const appId = cleanPath.replace("/app/", "");
    return {
      type: 'app',
      appId,
    };
  }

  // Fallback for short direct paths like /project, /experience, /certificate
  const directSlug = cleanPath.replace("/", "");
  if (FOLDER_MAP[directSlug]) {
    return {
      type: 'app',
      appId: 'finder',
      config: { initialPath: FOLDER_MAP[directSlug] },
    };
  }

  return { type: 'none' };
}
