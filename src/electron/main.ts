import { app, BrowserWindow, ipcMain } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResources } from "./managers/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import DatabaseService from "./managers/DatabaseService.js";

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 800,
    height: 700,
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

  ipcMainHandle("getBitcoinBuys", () => {
    return DatabaseService.getBitcoinBuys();
  });

  ipcMainHandle(
    "saveBitcoinBuy",
    (
      date: Date,
      amountPaidUsd: number,
      amountReceivedSats: number,
      memo: string
    ) => {
      return DatabaseService.saveBitcoinBuy(
        date,
        amountPaidUsd,
        amountReceivedSats,
        memo
      );
    }
  );

  ipcMainHandle("getHeadlineStats", () => {
    return DatabaseService.getHeadlineStats();
  });

  // ipcMainHandle("loadFile", (path: string) => {
  //   return loadFile(path);
  // });

  // start the electron services to keep the UI updated

  // pollResources(mainWindow);
});
