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
    console.log(prioritizer.prioritize(50)); // time supplied in ms
    console.log(prioritizer.prioritize(60)); // time supplied in ms
    console.log(prioritizer.prioritize(90)); // time supplied in ms
    console.log(prioritizer.prioritize(1000)); // time supplied in ms
  })
  .catch(console.error);
