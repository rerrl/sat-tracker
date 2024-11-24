import { app, BrowserWindow } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResources } from "./managers/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { loadAppData } from "./managers/data.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // set up event listeners
  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  ipcMainHandle("loadAppData", () => {
    return loadAppData();
  });

  // ipcMainHandle("loadFile", (path: string) => {
  //   return loadFile(path);
  // });

  // start the electron services to keep the UI updated
  pollResources(mainWindow);
});
