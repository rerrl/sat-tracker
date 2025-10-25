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
  // events to sub to
  statistics: Statistics;
  csvImported: void;
  headlineMetrics: HeadlineStats;

  // methods to call
  getStaticData: StaticData;
  getBitcoinBuys: BitcoinBuy[];
  saveBitcoinBuy: BitcoinBuy;
  getHeadlineStats: HeadlineStats;
  deleteBitcoinBuy: void;
  getBitcoinDeductions: BitcoinDeduction[];
  saveBitcoinDeduction: BitcoinDeduction;
  deleteBitcoinDeduction: void;
  triggerCsvImport: void;
  saveManualBitcoinPrice: void;
  createBalanceChangeEvent: BalanceChangeEvent;
  getBalanceChangeEvents: { events: BalanceChangeEvent[], total: number, totalPages: number };
  // enableSatTrader: void;
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

type BitcoinDeduction = {
  id: number;
  date: Date;
  amountSats: number;
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

type BalanceChangeEvent = {
  id: string;
  amountSats: number;
  valueCents: number | null;
  type: 'buy' | 'sell' | 'fee';
  memo: string | null;
  createdAt: Date;
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

    subscribeHeadlineMetrics: (
      callback: (headlineMetrics: HeadlineStats) => void
    ) => UnsubscribeFunction

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
    getBitcoinDeductions: () => Promise<BitcoinDeduction[]>;
    saveBitcoinDeduction: (
      date: Date,
      amountSats: number,
      memo: string | null
    ) => Promise<BitcoinDeduction>;
    deleteBitcoinDeduction: (id: number) => Promise<void>;
    triggerCsvImport: () => Promise<void>;
    saveManualBitcoinPrice: (price: number) => Promise<void>;
    createBalanceChangeEvent: (
      amountSats: number,
      valueCents: number | null,
      type: 'buy' | 'sell' | 'fee',
      memo: string | null
    ) => Promise<BalanceChangeEvent>;
    getBalanceChangeEvents: (
      page?: number,
      limit?: number
    ) => Promise<{ events: BalanceChangeEvent[], total: number, totalPages: number }>;
    // enableSatTrader: (bool: boolean) => void;
  };
}
