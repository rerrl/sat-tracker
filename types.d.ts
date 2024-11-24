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
  loadAppData: string;
  // loadFile: {
  //   success: boolean;
  //   data: string;
  // };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    loadAppData: () => Promise<string>;
    // loadFile: (path: string) => Promise<{
    //   success: boolean;
    //   data: string;
    // }>;
  };
}
