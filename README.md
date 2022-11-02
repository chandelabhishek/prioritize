## Question:

https://gist.github.com/Valve/834d7122ca75dc58d28c3e4be5a15506

#### What is the max USD value that can be processed in 50ms, 60ms, 90ms, 1000ms?

#### Answer

```
time         maxAmount in USD

50ms           4139.43
60ms           4675.71
90ms           6972.29
1000ms         35471.81
```

## Prerequisites:

node >= 16.14.2 is only pre-requisite

## Running the Prioritizer

1. Clone the repo
2. `npm i`
3. `npm run prioritize` (Run this to get answer to the asked question)

## Code Organisation

Prioritizer has 3 main classes doing all the work.

1. TransactionReader: It is responsible for reading CSV and returning the formatted list of Transactions
2. TransactionPrioritizer: It is responsible returning this list of qualified\* transaction for the given time. Once instantiated for a list of transactions it can be called over and over again for different `totalTime` values.
3. Prioritizer: It is a high level class which abstracts out TransactionReader and TransactionPrioritizer from the user. user only needs to work with this class.

qualified: All the transaction which collectively has maximum amount value for the given time.

Note: there are few more classes which are dummy and just there because it was mentioned in the question.

## Approach

This problem is a classic example of [0/1 Knapsack Problem](https://en.wikipedia.org/wiki/Knapsack_problem). Here this problem is being solved using bottom up Dynamic Programming.

### Why choose 0/1 Knapsack Using DP?

This problem can also be solved using other techniques like. `recursion`, `backtracking`, `branch and bound`

let's discuss a little bit about these techniques:

#### 1. Recursion:

This is a brute-force method and will explore all the possible solution and then select the maximum one. This is very costly(O(2^n)) in terms of execution time.

#### 2. Backtracking:

This algorithm only explores path till it is feasible to find a solution and hence it does better than the brute-force approach in terms of execution time. Although it's worst case complexity is still same as brute-force method.

#### 3. Branch and Bound

This approach works like backtracking and calculates best solution for every node starting from root and eliminates all the subtrees from where the best solution is not possible. Worst case complexity is still the same. Only minimisation problems can be solved from this approach. And it also uses Priority Queue for storing nodes. It is harder to implement.

All the above approaches has worse time complexity than DP approach. Implementing DP is simpler than the most efficient solution from the above bunch(i.e. branch bound). These are the reasons for choosing DP over all the methods listed above.

### High Level Algorithm

1. Read `transactions.csv` and convert this to Transaction Object. These objects holds the id and amount(correspond to profit in classical knapsack algorithm)
2. Read `latencies.json`. This contains latency for each transaction which corresponds to the weight of each object in the classical knapsack algorithm. This is mapped to transactions through `bankCountryCode` property
3. Apply 0/1 knapsack algorithm on this dataset.
4. Once we get maximum cumulative amount value, we need to find such transactions. This algorithm is explained below.

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

If the transaction dataset is larger than what could fit in the machine's memory, then this approach cannot be applied. Following are some improvements we can make:

1. To handle larger dataset, we can start with time scaling. We can consider each column to be of 2/5/10ms. However introducing this might introduce some errors as well.

2. To handle even larger dataset, it is probably better to machine learning route.
