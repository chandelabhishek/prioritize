/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {Prioritizer} from '../Prioritizer';
import {CSVReader} from '../CSVReader';
import {TransactionPrioritizer} from '../TransactionPrioritizer';
jest.mock('../TransactionPrioritizer');
jest.mock('../CSVReader');
describe('Prioritize', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should accept csv file and call TransactionPrioritizer', async () => {
    const prioritizer = new Prioritizer('filePath');
    await prioritizer.init();
    expect(prioritizer.filePath).toBe('filePath');
    expect(CSVReader).toHaveBeenCalled();
    expect(TransactionPrioritizer).toHaveBeenCalled();
    const csvReaderInstance = CSVReader.mock.instances[0];
    prioritizer.prioritize(40);

    expect(csvReaderInstance.read).toHaveBeenCalled();
    expect(CSVReader.mock.calls[0][0]).toBe('filePath');
    expect(
      TransactionPrioritizer.mock.instances[0].prioritize
    ).toHaveBeenCalled();
  });

  it('should throw error if prioritize is called before init', async () => {
    const prioritizer = new Prioritizer('filePath');

    expect(() => {
      prioritizer.prioritize(40);
    }).toThrow(new Error('Prioritizer is not initialized, call `init` method'));
  });
});
