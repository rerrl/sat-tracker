import { app, BrowserWindow, ipcMain } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData } from "./services/resource.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import DatabaseService from "./services/DatabaseService.js";
import FileService from "./services/FileService.js";

app.on("ready", async () => {
  // const isSatTraderEnabled = await DatabaseService.isSatTraderEnabled();
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 800,
    height: 860,
  });

  // set up the menu
  // await setupMenu(mainWindow)
  // await setupMenu(mainWindow, isSatTraderEnabled);

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

  ipcMainHandle(
    "saveBitcoinDeduction",
    (date: Date, amountSats: number, memo: string) => {
      return DatabaseService.saveBitcoinDeduction(date, amountSats, memo);
    }
  );

  ipcMainHandle("getBitcoinDeductions", () => {
    return DatabaseService.getBitcoinDeductions();
  });

  ipcMainHandle("deleteBitcoinDeduction", (id: number) => {
    return DatabaseService.deleteBitcoinDeduction(id);
  });

  ipcMainHandle("triggerCsvImport", () => {
    return FileService.importCSV();
  });

  ipcMainHandle("saveManualBitcoinPrice", (price: number) => {
    return DatabaseService.saveManualBitcoinPrice(price);
  });

  // ipcMainHandle("enableSatTrader", (bool: boolean) => {
  //   return DatabaseService.enableSatTrader(bool);
  // })

  // start the electron services to keep the UI updated
  // pollResources(mainWindow);
});

// const setupMenu = async (window: BrowserWindow, satTrader: boolean) => {
// const setupMenu = async (window: BrowserWindow) => {
//   const template: MenuItemConstructorOptions[] = [
//     {
//       label: "File",
//       submenu: [
//         {
//           label: "Import from CSV",
//           click: async () => {
//             await FileService.importCSV();
//           },
//         },
//       ],
//     },
//     // {
//     //   label: "Extras",
//     //   submenu: [
//     //     {
//     //       label: "Enable Sat Trader",
//     //       type: "checkbox",
//     //       click: async (menuItem) => {
//     //         const bool = menuItem.checked;
//     //         await DatabaseService.enableSatTrader(bool);
//     //       },
//     //       checked: satTrader,
//     //     }
//     //   ]
//     // }
//   ];

//   const menu = Menu.buildFromTemplate(template)
//   window.setMenu(menu);
// }
