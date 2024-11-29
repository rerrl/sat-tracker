import { app, BrowserWindow, Menu } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData } from "./services/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import DatabaseService from "./services/DatabaseService.js";
import FileService from "./services/FileService.js";

app.on("ready", async () => {

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 800,
    height: 860,
  });

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Import Coinbase Buys from CSV",
          click: async () => {
            await FileService.importCSV(mainWindow);

          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template)

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

  ipcMainHandle("deleteBitcoinBuy", (id: number) => {
    return DatabaseService.deleteBitcoinBuy(id);
  });

  ipcMainHandle("getHeadlineStats", () => {
    return DatabaseService.getHeadlineStats();
  });


  ipcMainHandle("saveBitcoinDeduction", (date: Date, amountSats: number, memo: string) => {
    return DatabaseService.saveBitcoinDeduction(date, amountSats, memo);
  })

  ipcMainHandle("getBitcoinDeductions", () => {
    return DatabaseService.getBitcoinDeductions();
  })

  ipcMainHandle("deleteBitcoinDeduction", (id: number) => {
    return DatabaseService.deleteBitcoinDeduction(id);
  })

  // start the electron services to keep the UI updated
  // pollResources(mainWindow);
});
