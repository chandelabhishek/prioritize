import {Transaction} from './Transaction';
import {TransactionPrioritizer} from './TransactionPrioritizer';
import {CSVReader} from './CSVReader';

/**
 * This class is responsible for taking in csv file
 * and calling underlying TransactionPrioritizer
 */
export class Prioritizer {
  readonly filePath: string;
  private transactionPrioritizer: TransactionPrioritizer;
  private csvReader: CSVReader;
  private ready = false;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async init() {
    console.log('Initializing CSV Reader....');
    this.csvReader = new CSVReader(this.filePath);
    console.log('Reading Transactions ....');
    const transactions = await this.csvReader.read();
    this.transactionPrioritizer = new TransactionPrioritizer(transactions);
    this.ready = true;
  }

  prioritize(totalTime: number): Transaction[] {
    if (!this.ready) {
      throw new Error('Prioritizer is not initialized, call `init` method');
    }
    return this.transactionPrioritizer.prioritize(totalTime);
  }
}
