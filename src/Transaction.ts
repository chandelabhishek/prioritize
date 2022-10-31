import latencies from '../latencies.json';

export class Transaction {
  readonly id: string;
  readonly amount: number;
  readonly bankCountryCode: keyof typeof latencies;

  constructor(
    id: string,
    amount: number,
    bankCountryCode: keyof typeof latencies
  ) {
    this.id = id;
    this.amount = amount;
    this.bankCountryCode = bankCountryCode;
  }
}
