import {join} from 'path';
import {Prioritizer} from './Prioritizer';

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
    prioritizer.prioritize(40);
    prioritizer.prioritize(60);
  })
  .catch(console.error);
