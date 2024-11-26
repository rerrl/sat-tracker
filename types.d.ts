type Statistics = {
  cpuUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type EventPayloadMapping = {
  statistics: Statistics;
  csvImported: void;
  getStaticData: StaticData;
  getBitcoinBuys: BitcoinBuy[];
  saveBitcoinBuy: BitcoinBuy;
  getHeadlineStats: HeadlineStats;
  deleteBitcoinBuy: void;
};

type BitcoinBuy = {
  id: number;
  date: Date;
  amountPaidUsd: number;
  amountReceivedSats: number;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type HeadlineStats = {
  bitcoinPrice: number;
  totalReturn: number;
  totalSats: number;
  valueUsd: number;
  averageEntry: number;
  totalInvested: number;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    // functions to subscribe to events from backend
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;

    subscribeCsvImported: (
      callback: () => void
    ) => UnsubscribeFunction;

    // functions to call backend functions
    getStaticData: () => Promise<StaticData>;
    getBitcoinBuys: () => Promise<BitcoinBuy[]>;
    saveBitcoinBuy: (
      date: Date,
      amountPaidUsd: number,
      amountReceivedSats: number,
      memo: string | null
    ) => Promise<BitcoinBuy>;
    getHeadlineStats: () => Promise<HeadlineStats>;
    deleteBitcoinBuy: (id: number) => Promise<void>;
  };
}
