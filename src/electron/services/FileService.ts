/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from "papaparse";
import fs from "fs";
import { dialog } from "electron";
import { BigNumber } from "bignumber.js";
import DatabaseService from "./DatabaseService.js";


class FileService {
    constructor() {
    }

    private promptForFile = async (title: string, fileType: 'csv') => {
        const filterName = fileType === 'csv' ? 'CSV Files' : 'All Files';

        return new Promise<string[]>((resolve) => {
            dialog.showOpenDialog({
                title,
                properties: ["openFile"],
                filters: [{ name: filterName, extensions: [fileType] }],
            }).then((result) => {
                resolve(result.filePaths);
            });
        });
    }

    private identifyCsvImportType = (parsed: Papa.ParseResult<any>) => {
        const data = parsed.data;
        if (data.length === 0) {
            return 'unknown';
        }

        if (this.isCoinbaseCsv(parsed)) {
            return 'coinbase';
        }
    }

    private isCoinbaseCsv = (parsed: Papa.ParseResult<any>) => {
        const data = parsed.data;
        if (data.length < 5) {
            return false;
        }

        if (data[0][0] === '' &&
            data[1][0] === 'Transactions' &&
            data[2][0] === 'User' &&
            data[3][0] === 'ID') {
            return true;
        } else {
            return false;
        }
    }

    private importCoinbaseBuysCsv = async (parsed: Papa.ParseResult<any>) => {
        const headers = parsed.data[3]
        const data = parsed.data.slice(4);

        const timestampIndex = headers.indexOf('Timestamp');
        const transactionTypeIndex = headers.indexOf('Transaction Type');
        const assetIndex = headers.indexOf('Asset');
        const priceCurrencyIndex = headers.indexOf('Price Currency');
        const totalBitcoinBoughtIndex = headers.indexOf('Quantity Transacted');
        const totalPaidInUSDIndex = headers.indexOf('Total (inclusive of fees and/or spread)');




        const dataToImport = data.filter((row: any) => row.length >= 5)
        dataToImport.forEach(async (row: any) => {
            const rawTimestamp = row[timestampIndex];
            const rawTransactionType = row[transactionTypeIndex];
            const rawAsset = row[assetIndex];
            const rawPriceCurrency = row[priceCurrencyIndex];
            const rawTotalBitcoinBought = row[totalBitcoinBoughtIndex];
            const rawTotalPaidInUSD = row[totalPaidInUSDIndex];

            const transactionType = rawTransactionType === 'Buy' || rawTransactionType === 'Advanced Trade Buy' ? 'buy' : undefined;
            const timestamp = new Date(rawTimestamp);
            const asset = rawAsset === 'BTC' ? 'bitcoin' : undefined;
            const priceCurrency = rawPriceCurrency === 'USD' ? 'usd' : undefined;
            const totalBitcoinBought = parseFloat(rawTotalBitcoinBought).toFixed(8);
            const totalPaidInUSD = parseFloat((rawTotalPaidInUSD as string).replace('$', '')).toFixed(2);

            if (transactionType !== 'buy' || asset !== 'bitcoin' || priceCurrency !== 'usd') {
                return;
            }

            await DatabaseService.saveBitcoinBuy(
                new Date(timestamp),
                new BigNumber(totalPaidInUSD).toNumber(),
                new BigNumber(totalBitcoinBought).multipliedBy(100000000).toNumber(),
                null
            );
        });
    }

    public importCSV = async () => {
        const filesToImport = await this.promptForFile("Import CSV", "csv");

        if (filesToImport.length === 0) {
            return [];
        }

        const file = filesToImport[0];
        const fileContents = fs.readFileSync(file, "utf8");
        const parsed = Papa.parse(fileContents);

        const importType = this.identifyCsvImportType(parsed);

        if (importType === 'unknown') {
            console.log('Unknown CSV format');
            return [];
        }

        if (importType === 'coinbase') {
            console.log('Coinbase CSV detected');
            return await this.importCoinbaseBuysCsv(parsed);
        }

    }
}

export default new FileService();