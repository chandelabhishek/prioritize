import {Transaction} from './Transaction';
/**
 * Dummy Class as described in the problem
 */
export class TransactionProcessor {
  constructor() {}

  processTransaction(transaction: Transaction): boolean {
    return transaction.id.includes('a') ? true : false;
  }

  processTransactions(transactions: Transaction[]) {
    const results: {id: string; fraudulent: boolean}[] = [];
    for (const transaction of transactions) {
      results.push({
        id: transaction.id,
        fraudulent: this.processTransaction(transaction),
      });
    }
    return results;
  }
}
