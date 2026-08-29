import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

config.autoAddCss = false;

if ("serviceWorker" in navigator) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  navigator.serviceWorker
    .register(`${base}/sw.js`, { scope: `${base}/` })
    .catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
