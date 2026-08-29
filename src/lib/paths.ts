/** Vite base URL — `/` locally, `/khanoumi1404/` on GitHub Pages. */
export const APP_BASE = import.meta.env.BASE_URL;

export function appPath(path: string): string {
  const clean = path.replace(/^\//, "");
  if (!clean) {
    const trimmed = APP_BASE.replace(/\/$/, "");
    return trimmed || "/";
  }
  return `${APP_BASE}${clean}`;
}

export function stripAppBase(pathname: string): "/" | "/war" {
  const base = APP_BASE.replace(/\/$/, "");
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  path = path.replace(/\/$/, "") || "/";
  return path === "/war" ? "/war" : "/";
}
