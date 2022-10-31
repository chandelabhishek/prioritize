## Question:

https://gist.github.com/Valve/834d7122ca75dc58d28c3e4be5a15506

## Prerequisites:

node >= 16.14.2 is only pre-requisite

## Running the Prioritizer

1. Clone the repo
2. `npm i`
3. `npm run prioritize`

## Code Organisation

Prioritizer has 3 main classes doing all the work.

1. TransactionReader: It is responsible for reading CSV and returning the formatted list of Transactions
2. TransactionPrioritizer: It is responsible returning this list of qualified\* transaction for the given time. Once instantiated for a list of transactions it can be called over and over again for different `totalTime` values.
3. Prioritizer: It is a high level class which abstracts out TransactionReader and TransactionPrioritizer from the user. user only needs to work with this class.

qualified: All the transaction which collectively has maximum amount value for the given time.

Note: there are few more classes which are dummy and just there because it was mentioned in the question.

## Approach

This problem is a classic example of [0/1 Knapsack Problem](https://en.wikipedia.org/wiki/Knapsack_problem). Here this problem is being solved using bottom up Dynamic Programming.

### High Level Algorithm

1. Read `transactions.csv` and convert this to Transaction Object. These objects holds the id and amount(correspond to profit in classical knapsack algorithm)
2. Read `latencies.json`. This contains latency for each transaction which corresponds to the weight of each object in the classical knapsack algorithm. This is mapped to transactions through `bankCountryCode` property
3. Apply 0/1 knapsack algorithm on this dataset.
4. Once we get maximum cumulative amount value, we need to find such transaction. This algorithm is explained below.

### 0/1 knapsack(bottom up DP, TransactionPrioritizer.ts)

For this we will create table V of N x W.
where N is number of transactions in CSV and W is `maxTotalTime` in ms.
We will fill this table iteratively.

there are 3 conditions to fill each cell.

1. V[i, j] = Max(either including this element, excluding this element) if latency of this transaction <= W[j].
2. V[i, j] = for all i=0 or j=0;
3. V[i, j] = previousMaxAmount, if latency of this transaction > W[j].

first conditions says, that optimal solution for [i, j] can be obtained by getting max of including or excluding current transaction.
<br/>including means: currentLatency + previousMaxAmount;
<br/>excluding means: previousMaxAmount (i.e. not selecting this transaction).

second conditions says: if either totalTime of number of object is 0 the best we can do is 0;

third condition says: if currentLatency > W[j] (i.e.) current time. then best we can do is what we have already done, i.e. previousMaxAmout.

### To get the subset of included transaction in priority list

We can use the previously calculated Table V for this.

There are only two possibilities:

1. Result comes from the row above (3rd condition in the above algorithm).
2. Result comes from Max(included, excluded)

Using above 2 observations we can find transactions in the knapsack.

#### Algo

input : maxAmount, totalTime

- iterate for all i in TransactionList
  - if maxAmount === V[i, totalTime] then continue;
  - else include this transaction in the result
    - deduct this transaction's amount from maxAmount
      - maxAmount := maxAmount - currentAmount
    - deduct this transaction's latency from totalTime
      - totalTime := totalTime - currentLatency

## Improvements

To handle larger dataset, we can start with time scaling. We can consider each column to be of 2/5/10ms. However introducing this might introduce some errors as well.

To handle even larger dataset, it is probably better to machine learning route.
