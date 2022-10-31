import {join} from 'path';
import {Prioritizer} from './Prioritizer';
import {Transaction} from './Transaction';

/**
 *
 *
 * EXAMPLE USAGE
 *
 * @param path
 * @param totalTime
 * @returns Transaction[]
 */

const csvFilePath = join(process.cwd(), 'transactions.csv');
const prioritizer = new Prioritizer(csvFilePath);

// initialize prioritizer before calling prioritize
prioritizer
  .init()
  .then(() => {
    prioritizer.prioritize(40).then(console.log);
    prioritizer.prioritize(60).then(console.log);
  })
  .catch(console.error);
