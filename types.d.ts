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
  getBitcoinBuys: BitcoinBuys[];
};

type BitcoinBuys = {
  id: number;
  date: Date;
  amountPaidUsd: number;
  amountReceivedSats: number;
  memo: string;
  createdAt: Date;
  updatedAt: Date;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    getBitcoinBuys: () => Promise<BitcoinBuys[]>;
  };
}
