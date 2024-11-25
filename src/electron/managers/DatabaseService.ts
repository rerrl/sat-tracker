import { getAppDataFolder } from "../pathResolver.js";
import { Sequelize, DataTypes } from "sequelize";

class DatabaseService {
  private sequelize: Sequelize;
  private databaseReady: boolean = false;

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

  private async awaitDatabaseReady(): Promise<void> {
    while (!this.databaseReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default new DatabaseService();
