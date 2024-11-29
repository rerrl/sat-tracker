import { BigNumber } from "bignumber.js";
import { getAppDataFolder } from "../pathResolver.js";
import { Sequelize, DataTypes } from "sequelize";

class DatabaseService {
  private sequelize: Sequelize;
  private databaseReady: boolean = false;
  private bitcoinPrice = 0;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: getAppDataFolder() + "/database.sqlite",
    });
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database:", error);
      });

    this.sequelize.define("BitcoinBuy", {
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

    this.sequelize.define("DeductionEvent", {
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
    })

    this.sequelize.sync().then(() => {
      this.databaseReady = true;
    });
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

    return latestBuy.toJSON() as BitcoinBuy;
  }

  public async getBitcoinBuys(): Promise<BitcoinBuy[]> {
    await this.awaitDatabaseReady();

    const buys = await this.sequelize.models.BitcoinBuy.findAll({
      order: [["date", "DESC"]],
    });
    return buys.map((buy) => buy.toJSON() as BitcoinBuy);
  }

  public async getHeadlineStats(): Promise<HeadlineStats> {
    await this.awaitDatabaseReady();

    if (this.bitcoinPrice === 0) {
      const bitcoinPriceResponse = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );

      this.bitcoinPrice = (
        await bitcoinPriceResponse.json()
      ).bpi.USD.rate_float;
    }

    const totalInvested =
      (await this.sequelize.models.BitcoinBuy.sum("amountPaidUsd")) || 0;

    const totalSats =
      (await this.sequelize.models.BitcoinBuy.sum("amountReceivedSats")) || 0;

    const valueUsd = (totalSats / 100000000) * this.bitcoinPrice;

    const totalReturn = valueUsd - totalInvested;

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

  public async deleteBitcoinBuy(id: number): Promise<void> {
    await this.awaitDatabaseReady();

    await this.sequelize.models.BitcoinBuy.destroy({
      where: {
        id,
      },
    });
  }

  public async saveBitcoinDeduction(date: Date, amountSats: number, memo: string | null): Promise<BitcoinDeduction> {
    await this.awaitDatabaseReady();

    const deduction = await this.sequelize.models.DeductionEvent.create({
      date,
      amountSats,
      memo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return deduction.toJSON() as BitcoinDeduction;
  }

  public async getBitcoinDeductions(): Promise<BitcoinDeduction[]> {
    await this.awaitDatabaseReady();

    const deductions = await this.sequelize.models.DeductionEvent.findAll({
      order: [["date", "DESC"]],
    });

    return deductions.map((deduction) => deduction.toJSON() as BitcoinDeduction);
  }

  public async deleteBitcoinDeduction(id: number): Promise<void> {
    await this.awaitDatabaseReady();

    await this.sequelize.models.DeductionEvent.destroy({
      where: {
        id,
      },
    });
  }

  private async awaitDatabaseReady(): Promise<void> {
    while (!this.databaseReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default new DatabaseService();
