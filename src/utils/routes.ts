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
    const basePath = config?.pdfPath?.includes("Portofolio")
      ? "/preview/portfolio"
      : `/preview/${encodeURIComponent((config?.title || "doc").toLowerCase().replace(/\s+/g, '-'))}`;

    const params = new URLSearchParams();
    if (config?.page && config.page > 1) {
      params.set("page", String(config.page));
    }
    if (config?.zoom && config.zoom !== 100) {
      params.set("zoom", String(config.zoom));
    }
    if (config?.rotation && config.rotation !== 0) {
      params.set("rotation", String(config.rotation));
    }
    // Sidebar default is true. Only serialize when user closes it (sidebar=false)
    if (config?.sidebar === false) {
      params.set("sidebar", "false");
    }
    if (isMaximized) {
      params.set("maximized", "true");
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  if (appId === "wallpaper_settings") {
    return `/settings/wallpaper${maxParam}`;
  }

  return `/app/${appId}${maxParam}`;
}

/**
 * Parses a browser pathname and search params into an app/folder command with toolbar state
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

  const pageParam = searchParams.get("page");
  const zoomParam = searchParams.get("zoom");
  const rotationParam = searchParams.get("rotation");
  const sidebarParam = searchParams.get("sidebar");

  const parsedPage = pageParam ? parseInt(pageParam, 10) : undefined;
  const parsedZoom = zoomParam ? parseInt(zoomParam, 10) : undefined;
  const parsedRotation = rotationParam ? parseInt(rotationParam, 10) : undefined;
  // Default is true, only false if explicitly "false" or "0"
  const parsedSidebar = sidebarParam !== null ? (sidebarParam !== "false" && sidebarParam !== "0") : undefined;

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
      config: { 
        title: 'Portofolio Hadi 2026.pdf', 
        pdfPath: '/Portofolio Hadi 2026.pdf',
        page: parsedPage,
        zoom: parsedZoom,
        rotation: parsedRotation,
        sidebar: parsedSidebar
      },
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
