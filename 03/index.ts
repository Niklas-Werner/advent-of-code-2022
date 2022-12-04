import { UnexpectedError } from '@nw55/common';
import { logResult, runDay } from '../utils';

const CC_CAPITAL_A = 'A'.charCodeAt(0);
const CC_SMALL_A = 'a'.charCodeAt(0);
const CC_CAPITAL_Z = 'Z'.charCodeAt(0);
const CC_SMALL_Z = 'z'.charCodeAt(0);

function getPriority(item: string) {
    const code = item.charCodeAt(0);
    if (code >= CC_SMALL_A && code <= CC_SMALL_Z)
        return code - CC_SMALL_A + 1;
    if (code >= CC_CAPITAL_A && code <= CC_CAPITAL_Z)
        return code - CC_CAPITAL_A + 27;
    throw new UnexpectedError();
}

runDay(__dirname, {}, input => {

    const rucksacks = input.map(line => {
        const left = line.slice(0, line.length / 2);
        const right = line.slice(line.length / 2);
        return [left.split(''), right.split('')];
    });

    const commonItems = rucksacks.map(([compartment1, compartment2]) =>
        compartment1.find(item => compartment2.includes(item))!);

    const priorities = commonItems.map(getPriority);
    const prioritySum = priorities.reduce((a, b) => a + b, 0);

    let badgePrioritySum = 0;
    for (let i = 0; i < input.length; i += 3) {
        const badge = input[i].split('').find(item =>
            input[i + 1].includes(item) && input[i + 2].includes(item))!;
        badgePrioritySum += getPriority(badge);
    }

    logResult({ prioritySum, badgePrioritySum });

});
