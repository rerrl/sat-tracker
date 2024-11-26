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
  getStaticData: StaticData;
  getBitcoinBuys: BitcoinBuy[];
  saveBitcoinBuy: BitcoinBuy;
  getHeadlineStats: HeadlineStats;
  deleteBitcoinBuy: void;
  importBitcoinBuysCSV: string[];
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
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
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
    importBitcoinBuysCSV: () => Promise<string[]>;
  };
}
