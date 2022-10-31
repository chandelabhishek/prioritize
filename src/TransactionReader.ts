import * as fs from 'fs';
import {parse} from 'csv-parse';
import {finished} from 'stream/promises';
import {Transaction} from './Transaction';
import latencies from '../latencies.json';

export class TransactionReader {
  private path: string;
  constructor(path: string) {
    this.path = path;
  }

  private async processFile(): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const parser = fs
      .createReadStream(this.path)
      .pipe(parse({columns: true, skip_empty_lines: true, cast: true}));

    parser.on('readable', () => {
      let transaction: {
        id: string;
        amount: number;
        bank_country_code: keyof typeof latencies;
      };

      while ((transaction = parser.read()) !== null) {
        transactions.push(
          new Transaction(
            transaction.id,
            transaction.amount,
            transaction.bank_country_code
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
