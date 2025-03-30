import { BigNumber } from "bignumber.js";
import { getAppDataFolder } from "../pathResolver.js";
import { Sequelize, DataTypes } from "sequelize";
import { ipcWebContentsSend } from "../util.js";
import { BrowserWindow } from "electron";

class DatabaseService {
  private sequelize: Sequelize;
  private databaseReady: boolean = false;
  private bitcoinPrice = 0;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: getAppDataFolder() + "/database.sqlite",
    });

    this.setupDatabase(this.sequelize);
  }

  public async getHeadlineStats(): Promise<HeadlineStats> {
    await this.awaitDatabaseReady();

    if (this.bitcoinPrice === 0) {
      try {
        const bitcoinPriceResponse = await fetch(
          "https://data-api.coindesk.com/index/cc/v1/latest/tick?market=cadli&instruments=BTC-USD&apply_mapping=true"
        );
        this.bitcoinPrice = (await bitcoinPriceResponse.json()).Data["BTC-USD"]
          .VALUE as number;
      } catch (error) {
        console.error("Failed to fetch Bitcoin price:", error);
        // Only use manual price if API fails and we have one set this session
        if (this.bitcoinPrice === 0) {
          const manualPrice = await this.sequelize.models.ManualPrice.findOne({
            order: [["updatedAt", "DESC"]],
          });
          if (manualPrice) {
            this.bitcoinPrice = manualPrice.getDataValue("price");
          }
        }
      }
    }

    const totalInvested =
      (await this.sequelize.models.BitcoinBuy.sum("amountPaidUsd")) || 0;
    const totalSatsBought =
      (await this.sequelize.models.BitcoinBuy.sum("amountReceivedSats")) || 0;
    const totalSatsDeducted =
      (await this.sequelize.models.DeductionEvent.sum("amountSats")) || 0;
    const totalSats = BigNumber(totalSatsBought)
      .minus(totalSatsDeducted)
      .toNumber();
    const valueUsd = BigNumber(totalSats)
      .dividedBy(100000000)
      .multipliedBy(this.bitcoinPrice)
      .toNumber();
    const totalReturn = BigNumber(valueUsd).minus(totalInvested).toNumber();

    const averageEntry =
      BigNumber(totalInvested)
        .div(totalSats)
        .multipliedBy(100000000)
        .toNumber() || 0;

    return {
      bitcoinPrice: this.bitcoinPrice,
      totalReturn,
      totalSats,
      valueUsd,
      averageEntry,
      totalInvested,
    };
  }

  public async saveBitcoinBuy(
    date: Date,
    amountPaidUsd: number,
    amountReceivedSats: number,
    memo: string | null
  ): Promise<BitcoinBuy> {
    await this.awaitDatabaseReady();

    const latestBuy = await this.sequelize.models.BitcoinBuy.create({
      date,
      amountPaidUsd,
      amountReceivedSats,
      memo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.pushLatestHeadlineStatsToUI();
    return latestBuy.toJSON() as BitcoinBuy;
  }

  public async deleteBitcoinBuy(id: number): Promise<void> {
    await this.awaitDatabaseReady();

    await this.sequelize.models.BitcoinBuy.destroy({
      where: {
        id,
      },
    });
    await this.pushLatestHeadlineStatsToUI();
  }

  public async getBitcoinBuys(): Promise<BitcoinBuy[]> {
    await this.awaitDatabaseReady();

    const buys = await this.sequelize.models.BitcoinBuy.findAll({
      order: [["date", "DESC"]],
    });
    return buys.map((buy) => buy.toJSON() as BitcoinBuy);
  }

  public async saveBitcoinDeduction(
    date: Date,
    amountSats: number,
    memo: string | null
  ): Promise<BitcoinDeduction> {
    await this.awaitDatabaseReady();

    const deduction = await this.sequelize.models.DeductionEvent.create({
      date,
      amountSats,
      memo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.pushLatestHeadlineStatsToUI();
    return deduction.toJSON() as BitcoinDeduction;
  }

  public async saveManualBitcoinPrice(price: number): Promise<void> {
    await this.awaitDatabaseReady();
    await this.sequelize.models.ManualPrice.create({
      price,
      updatedAt: new Date(),
    });
    this.bitcoinPrice = price;
    // Force update all headline stats with the new price
    const updatedStats = await this.getHeadlineStats();
    await this.pushLatestHeadlineStatsToUI();
    // Also update the UI with the new stats
    ipcWebContentsSend(
      "headlineMetrics",
      BrowserWindow.getAllWindows()[0].webContents,
      updatedStats
    );
  }

  public async deleteBitcoinDeduction(id: number): Promise<void> {
    await this.awaitDatabaseReady();

    await this.sequelize.models.DeductionEvent.destroy({
      where: {
        id,
      },
    });

    await this.pushLatestHeadlineStatsToUI();
  }

  public async getBitcoinDeductions(): Promise<BitcoinDeduction[]> {
    await this.awaitDatabaseReady();

    const deductions = await this.sequelize.models.DeductionEvent.findAll({
      order: [["date", "DESC"]],
    });

    return deductions.map(
      (deduction) => deduction.toJSON() as BitcoinDeduction
    );
  }

  private async pushLatestHeadlineStatsToUI(): Promise<void> {
    await this.awaitDatabaseReady();
    ipcWebContentsSend(
      "headlineMetrics",
      BrowserWindow.getAllWindows()[0].webContents,
      await this.getHeadlineStats()
    );
  }

  private async awaitDatabaseReady(): Promise<void> {
    while (!this.databaseReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private setupDatabase(sequelize: Sequelize): void {
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database:", error);
      });

    sequelize.define("BitcoinBuy", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amountPaidUsd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      amountReceivedSats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    sequelize.define("ManualPrice", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    sequelize.define("DeductionEvent", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amountSats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // sequelize.define("Features", {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   name: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true,
    //   },
    //   enabled: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false,
    //   },
    // })

    sequelize.sync().then(() => {
      this.databaseReady = true;
    });
  }
}

export default new DatabaseService();
