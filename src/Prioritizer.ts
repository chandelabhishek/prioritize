import {Transaction} from './Transaction';
import {TransactionPrioritizer} from './TransactionPrioritizer';
import {TransactionReader} from './TransactionReader';

/**
 * This class is responsible for taking in csv file
 * and calling underlying TransactionPrioritizer
 */
export class Prioritizer {
  readonly filePath: string;
  private transactionPrioritizer: TransactionPrioritizer;
  private transactionReader: TransactionReader;
  private ready = false;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async init() {
    console.log('Initializing CSV Reader....');
    this.transactionReader = new TransactionReader(this.filePath);
    console.log('Reading Transactions ....');
    const transactions = await this.transactionReader.read();
    this.transactionPrioritizer = new TransactionPrioritizer(transactions);
    this.ready = true;
  }

  prioritize(totalTime: number): {
    maxAmount: number;
    transactions: Transaction[];
  } {
    if (!this.ready) {
      throw new Error('Prioritizer is not initialized, call `init` method');
    }
    return this.transactionPrioritizer.prioritize(totalTime);
  }
}
