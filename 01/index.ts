import { logResult, parseDecimalInt, runDay } from '../utils';

runDay(__dirname, { blankLines: 'group' }, input => {

    const values = input.map(lines => lines.map(parseDecimalInt));
    const sums = values.map(elfValues => elfValues.reduce((a, b) => a + b), 0);
    const maxSum = Math.max(...sums);
    const sortedSums = sums.slice().sort((a, b) => b - a);
    const top3Sum = sortedSums[0] + sortedSums[1] + sortedSums[2];

    logResult({ maxSum, top3Sum });

});
