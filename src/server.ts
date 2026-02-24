import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runDigestOnce } from "./digestService.js";
import { loadSettings, saveSettings } from "./settingsStore.js";
import { refreshSchedule } from "./scheduler.js";
import { validateSettings } from "./validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json({ limit: "1mb" }));

const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/settings", async (_req, res) => {
  const settings = await loadSettings();
  res.json(settings);
});

app.put("/api/settings", async (req, res) => {
  const valid = validateSettings(req.body);
  if (!valid.ok) {
    res.status(400).json({ error: valid.error });
    return;
  }
  const saved = await saveSettings(valid.value);
  await refreshSchedule();
  res.json(saved);
});

app.post("/api/run-now", async (_req, res) => {
  try {
    const result = await runDigestOnce();
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    res.status(500).json({ error: message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(publicDir, "index.html"));
});

export function createApp() {
  return app;
}

const port = Number(process.env.PORT ?? 3000);

if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
  refreshSchedule()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start scheduler:", error);
      process.exit(1);
    });
}
