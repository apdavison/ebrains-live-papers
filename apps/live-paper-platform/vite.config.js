import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheRoot = path.resolve(__dirname, "../../cache_backup");

function localCache() {
  const enabled = !["false", "0"].includes(process.env.VITE_LOCAL_CACHE);
  return {
    name: "local-cache",
    configureServer(server) {
      if (!enabled) {
        server.config.logger.info("[local-cache] disabled");
        return;
      }
      server.config.logger.info(`[local-cache] serving from ${cacheRoot}`);
      server.middlewares.use("/cache", (req, res, next) => {
        const rel = decodeURIComponent((req.url || "/").split("?")[0]);
        if (!rel.endsWith(".json")) return next();
        const full = path.resolve(cacheRoot, "." + rel);
        if (!full.startsWith(cacheRoot + path.sep)) return next();
        fs.stat(full, (err, stat) => {
          if (err || !stat.isFile()) return next();
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-cache");
          fs.createReadStream(full).pipe(res);
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localCache()],
  assetsInclude: ["**/*.njk"],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8", // or "istanbul"
    },
    setupFiles: ["./__tests__/setup.js"],
  }
});
