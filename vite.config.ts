import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const base = process.env.VITE_BASE_PATH || "/";

/** Rewrite root-absolute public URLs in bundles when deployed under a subpath. */
function rewriteAbsolutePublicUrls(prefix: string): Plugin {
  const root = prefix.replace(/\/$/, "");
  if (!root) return { name: "rewrite-absolute-public-urls-noop" };

  const rewrite = (code: string) =>
    code
      .replaceAll('"/assets/', `"${root}/assets/`)
      .replaceAll("'/assets/", `'${root}/assets/`)
      .replaceAll('"/fonts/', `"${root}/fonts/`)
      .replaceAll("'/fonts/", `'${root}/fonts/`)
      .replaceAll('"/annual-report.pdf', `"${root}/annual-report.pdf`)
      .replaceAll('"/war-report.pdf', `"${root}/war-report.pdf`)
      .replaceAll('"/site.webmanifest', `"${root}/site.webmanifest`);

  return {
    name: "rewrite-absolute-public-urls",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          file.code = rewrite(file.code);
        } else if (file.type === "asset" && typeof file.source === "string") {
          file.source = rewrite(file.source);
        }
      }
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), rewriteAbsolutePublicUrls(base)],
  appType: "spa",
  server: { port: 5173, host: "127.0.0.1" },
});
