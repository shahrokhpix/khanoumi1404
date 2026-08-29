/**
 * Patches all useInView-style IntersectionObserver hooks in src/components/
 * to support replay-on-scroll: remove the "once" disconnect, add else { setX(false) }.
 *
 * Old pattern (any of these forms):
 *   if (e?.isIntersecting) { setFoo(true); io.disconnect(); }
 *   if (entry.isIntersecting) { setBar(true); io.disconnect(); }
 *
 * New pattern:
 *   if (e?.isIntersecting) { setFoo(true); } else { setFoo(false); }
 *
 * Also patches class-toggle observers that call io.unobserve:
 *   if (...isIntersecting) { el.classList.add(X); io.unobserve(el); }
 * →
 *   if (...isIntersecting) { el.classList.add(X); } else { el.classList.remove(X); }
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = fileURLToPath(new URL(".", import.meta.url));
const srcDir = join(__dir, "../src/components");

function walk(dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if ([".tsx", ".ts"].includes(extname(f))) results.push(full);
  }
  return results;
}

let totalFiles = 0;
let patchedFiles = 0;

for (const file of walk(srcDir)) {
  totalFiles++;
  let src = readFileSync(file, "utf8");
  const orig = src;

  // Pattern 1: setState(true) + io.disconnect() inside if (isIntersecting)
  // Matches things like:
  //   if (e?.isIntersecting) {\n          setOn(true);\n          io.disconnect();\n        }
  src = src.replace(
    /if\s*\((\w+)\??\.isIntersecting\)\s*\{([^}]*?)(set\w+)\(true\);[^}]*?io\.disconnect\(\);[^}]*?\}/gs,
    (_match, varName, before, setter) => {
      const b = before.trimEnd();
      return `if (${varName}?.isIntersecting) {${b}\n          ${setter}(true);\n        } else {\n          ${setter}(false);\n        }`;
    }
  );

  // Also handle: if (entry.isIntersecting) { setX(true); io.disconnect(); }
  // (without ?.)
  src = src.replace(
    /if\s*\((\w+)\.isIntersecting\)\s*\{([^}]*?)(set\w+)\(true\);[^}]*?io\.disconnect\(\);[^}]*?\}/gs,
    (_match, varName, before, setter) => {
      const b = before.trimEnd();
      return `if (${varName}.isIntersecting) {${b}\n          ${setter}(true);\n        } else {\n          ${setter}(false);\n        }`;
    }
  );

  // Pattern 2: classList.add + io.unobserve inside if (isIntersecting)
  src = src.replace(
    /if\s*\((\w+)\??\.isIntersecting\)\s*\{([^}]*?)((?:entry|el|target|wrap|ref\.current)\s*\.classList\.add\([^)]+\))\s*;\s*io\.unobserve\([^)]+\)\s*;[^}]*?\}/gs,
    (_match, varName, before, addCall) => {
      const b = before.trimEnd();
      const removeCall = addCall.replace(/\.add\(/, ".remove(");
      return `if (${varName}?.isIntersecting) {${b}\n          ${addCall};\n        } else {\n          ${removeCall};\n        }`;
    }
  );

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    patchedFiles++;
    console.log("patched:", file.replace(srcDir, "src/components"));
  }
}

console.log(`\nDone. ${patchedFiles}/${totalFiles} files patched.`);
