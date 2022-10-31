import path from 'path';
import {CSVReader} from '../CSVReader';
import {Transaction} from '../Transaction';

describe('CSVReader', () => {
  it('should read CSV file and return transactions', async () => {
    const csvReader = new CSVReader(
      path.join(__dirname, 'sample_transaction.csv')
    );

    const transactions: Transaction[] = await csvReader.read();

    expect(transactions).toStrictEqual([
      new Transaction('dde3165e-a7e9-4dac-984b-4aa5f32a45e2', 6.44, 'tr'),
      new Transaction('95c6e393-e3dd-499e-b6bf-d075fc2abbc5', 9.31, 'uk'),
      new Transaction('a3d2343c-ee13-4947-8815-aac418997fdc', 88.57, 'us'),
    ]);
  });
});
