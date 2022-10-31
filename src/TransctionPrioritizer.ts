import {Transaction} from './Transaction';
import latencies from '../latencies.json';
const MAX_TOTAL_TIME = 1001;

/**
 *
 *  This class is responsible for getting transactions
 *  which has cumulatively has maximum value(Amount) in a given time
 *  This is done through 0/1 knapsack algorithm using Dynamic Programming
 */
export class TransactionPrioritizer {
  dp: number[][];
  transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    this.dp = Array.from({length: transactions.length + 1}).map(() =>
      Array.from({length: MAX_TOTAL_TIME})
    );
  }

  // to fix JS floating point calculations
  private toFixedDecimal(number: number): number {
    return parseFloat((Math.round(number * 100) / 100).toFixed(2));
  }

  /**
   *
   * maximize amount for given totalTime
   * references: https://en.wikipedia.org/wiki/Knapsack_problem
   **/
  private getMaximumAmountValue(totalTime: number) {
    // check if it is already calculated for given time, if yes, return
    if (this.dp[this.transactions.length][totalTime] !== undefined) {
      return this.dp[this.transactions.length][totalTime];
    }

    const numberOfTransactions = this.transactions.length;

    // 0/1 knapsack Implementation using bottom up DP
    for (let trx = 0; trx <= numberOfTransactions; trx += 1) {
      for (let time = 0; time <= totalTime; time += 1) {
        if (trx === 0 || time === 0) {
          this.dp[trx][time] = 0;
          continue;
        }

        const currentLatency =
          latencies[this.transactions[trx - 1].bankCountryCode];
        const excluded = this.dp[trx - 1][time];
        const maxAmountTillNow = this.dp[trx - 1][time - currentLatency];
        const currentAmount = this.transactions[trx - 1].amount;

        const included = this.toFixedDecimal(maxAmountTillNow + currentAmount);

        if (currentLatency <= time) {
          this.dp[trx][time] = Math.max(included, excluded);
        } else {
          this.dp[trx][time] = excluded;
        }
      }
    }
    return this.dp[numberOfTransactions][totalTime];
  }

  // get List of all transactions which will be processed in a given time
  private getTransactionsForMaxAmount(
    maxAmount: number,
    totalTime: number
  ): Transaction[] {
    let maxTime = totalTime;
    let amount = maxAmount;
    const result: Transaction[] = [];

    for (let trx = this.transactions.length; trx > 0 && amount > 0; trx -= 1) {
      if (amount !== this.dp[trx - 1][maxTime]) {
        const latency = latencies[this.transactions[trx - 1].bankCountryCode];
        const currentAmount = this.transactions[trx - 1].amount;

        result.push(this.transactions[trx - 1]);
        amount = this.toFixedDecimal(amount - currentAmount);
        maxTime = maxTime - latency;
      }
    }

    return result;
  }

  prioritize(totalTime: number): Transaction[] {
    if (totalTime > MAX_TOTAL_TIME) {
      throw new Error('Total Time Passed Exceeds Maximum Allowed Time');
    }
    if (!this.transactions || this.transactions.length === 0) {
      throw new Error('Prioritizer needs a transaction list :(');
    }
    const maxAmount = this.getMaximumAmountValue(totalTime);
    return this.getTransactionsForMaxAmount(maxAmount, totalTime);
  }
}
