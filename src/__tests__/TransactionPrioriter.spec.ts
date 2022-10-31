/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import path from 'path';
import {TransactionReader} from '../TransactionReader';
import {Transaction} from '../Transaction';
import {TransactionPrioritizer} from '../TransactionPrioritizer';

async function getSampleTransactions() {
  const transactionReader = new TransactionReader(
    path.join(__dirname, 'sample_transaction.csv')
  );

  return transactionReader.read();
}

describe('TransactionProcessor', () => {
  it('should return list of transactions that will be considered in a given time and will have maximum cumulative amount', async () => {
    const transactions = await getSampleTransactions();
    const transactionPrioritizer = new TransactionPrioritizer(transactions);

    expect(transactionPrioritizer.prioritize(100)).toStrictEqual([
      new Transaction('a3d2343c-ee13-4947-8815-aac418997fdc', 88.57, 'us'),
      new Transaction('95c6e393-e3dd-499e-b6bf-d075fc2abbc5', 9.31, 'uk'),
    ]);
  });

  it('should throw error when transaction list is not passed', async () => {
    const transactionPrioritizer = new TransactionPrioritizer(null);

    expect(() => {
      transactionPrioritizer.prioritize(100);
    }).toThrowError('Prioritizer needs a transaction list :(');
  });

  it('should throw error when totalTime is more than supported totalTime list is not passed', async () => {
    const transactions = await getSampleTransactions();
    const transactionPrioritizer = new TransactionPrioritizer(transactions);

    expect(() => {
      transactionPrioritizer.prioritize(10000);
    }).toThrowError('Total Time Passed Exceeds Maximum Allowed Time');
  });
});
