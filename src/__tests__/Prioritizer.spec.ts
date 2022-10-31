/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {Prioritizer} from '../Prioritizer';
import {TransactionReader} from '../TransactionReader';
import {TransactionPrioritizer} from '../TransactionPrioritizer';
jest.mock('../TransactionPrioritizer');
jest.mock('../TransactionReader');
describe('Prioritize', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should accept csv file and call TransactionPrioritizer', async () => {
    const prioritizer = new Prioritizer('filePath');
    await prioritizer.init();
    expect(prioritizer.filePath).toBe('filePath');
    expect(TransactionReader).toHaveBeenCalled();
    expect(TransactionPrioritizer).toHaveBeenCalled();
    const TransactionReaderInstance = TransactionReader.mock.instances[0];
    prioritizer.prioritize(40);

    expect(TransactionReaderInstance.read).toHaveBeenCalled();
    expect(TransactionReader.mock.calls[0][0]).toBe('filePath');
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
