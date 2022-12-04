import { logResult, parseDecimalInt, runDay } from '../utils';

runDay(__dirname, {}, input => {

    const pairs = input.map(line => line.split(',').map(range => range.split('-').map(parseDecimalInt)));

    const fullyContainedCount = pairs.filter(([[start1, end1], [start2, end2]]) =>
        start1 >= start2 && end1 <= end2 || start2 >= start1 && end2 <= end1
    ).length;

    const overlapCount = pairs.filter(([[start1, end1], [start2, end2]]) =>
        start1 <= end2 && start2 <= end1
    ).length;

    logResult({ fullyContainedCount, overlapCount });

});
