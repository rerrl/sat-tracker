import { app, BrowserWindow, Menu } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, promptForFile, } from "./managers/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import DatabaseService from "./managers/DatabaseService.js";

app.on("ready", async () => {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Import CSV",
          click: async () => {
            const filesToImport = await promptForFile();
            console.log({ filesToImport });
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

  ipcMainHandle("importBitcoinBuysCSV", async () => {
    const filesToImport = await promptForFile();
    console.log({ filesToImport });
    return filesToImport;
  })

  // start the electron services to keep the UI updated
  // pollResources(mainWindow);
});
