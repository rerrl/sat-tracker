import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "dist-electron/preload.cjs"
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

function getUsersHomePath() {
  return app.getPath("home");
}

export function getAppDataFolder() {
  const appDataPath = path.join(getUsersHomePath(), ".sat-tracker");
  const devDataPath = path.join(appDataPath, "dev");
  return isDev() ? devDataPath : appDataPath;
}
