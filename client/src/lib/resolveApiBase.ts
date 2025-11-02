/**
 * Centralized API base resolution
 * Eliminates dev/prod URL inconsistencies
 */

export function resolveApiBase(): string {
  // Priority 1: Explicit environment variable
  const envBase = import.meta.env.VITE_API_BASE;
  if (envBase) {
    return envBase.replace(/\/+$/, ""); // Remove trailing slashes
  }

  // Priority 2: Global window.__API_BASE__ (if set by build)
  const windowBase = (window as any).__API_BASE__;
  if (windowBase) {
    return windowBase.replace(/\/+$/, "");
  }

  // Priority 3: Same-origin (default for reverse proxy setups)
  return "";
}

/**
 * Build full API URL
 */
export function apiUrl(path: string): string {
  const base = resolveApiBase();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
