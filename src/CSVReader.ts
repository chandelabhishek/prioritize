import * as fs from 'fs';
import {parse} from 'csv-parse';
import {finished} from 'stream/promises';
import {Transaction} from './Transaction';
import latencies from '../latencies.json';

export class CSVReader {
  private path: string;
  constructor(path: string) {
    this.path = path;
  }

  private async processFile(): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const parser = fs.createReadStream(this.path).pipe(parse());
    parser.on('readable', () => {
      let transaction: [string, string, keyof typeof latencies];

      while ((transaction = parser.read()) !== null) {
        transactions.push(
          new Transaction(
            transaction?.[0],
            parseFloat(transaction?.[1]),
            transaction?.[2]
          )
        );
      }
    });
    await finished(parser);
    return transactions;
  }

  read(): Promise<Transaction[]> {
    return this.processFile();
  }
}
