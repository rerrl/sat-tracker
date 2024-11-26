import { IpcRendererEvent } from "electron";

const electron = require("electron");

// methods to expose to the UI
electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) => {
    return ipcOn("statistics", (statistics) => callback(statistics));
  },
  subscribeCsvImported: (callback) => {
    return ipcOn("csvImported", () => callback());
  },
  getStaticData: () => ipcInvoke("getStaticData"),
  getBitcoinBuys: () => ipcInvoke("getBitcoinBuys"),
  saveBitcoinBuy: (
    date: Date,
    amountPaidUsd: number,
    amountReceivedSats: number,
    memo: string | null
  ) =>
    ipcInvoke("saveBitcoinBuy", date, amountPaidUsd, amountReceivedSats, memo),
  getHeadlineStats: () => ipcInvoke("getHeadlineStats"),
  deleteBitcoinBuy: (id: number) => ipcInvoke("deleteBitcoinBuy", id),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...args: any[]
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, ...args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: IpcRendererEvent, payload: any) => callback(payload);

  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
