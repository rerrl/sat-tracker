import { app, BrowserWindow, Menu } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData } from "./services/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import DatabaseService from "./services/DatabaseService.js";
import FileService from "./services/FileService.js";

app.on("ready", async () => {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Import Coinbase Buys from CSV",
          click: async () => {
            await FileService.importCSV();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template)

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 800,
    height: 700,
  });

  mainWindow.setMenu(menu);

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

  ipcMainHandle("deleteBitcoinBuy", (id: number) => {
    return DatabaseService.deleteBitcoinBuy(id);
  });

  // start the electron services to keep the UI updated
  // pollResources(mainWindow);
});
