import { isArray } from '@nw55/common';
import { logResult, notNull, runDay } from '../utils';

type Packet = number | Packet[];

function compareLists(left: Packet[], right: Packet[]) {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
        const result = compare(left[i], right[i]);
        if (result !== 0)
            return result;
    }
    return left.length - right.length;
}

function compare(left: Packet, right: Packet): number {
    if (isArray(left)) {
        if (isArray(right))
            return compareLists(left, right);
        return compare(left, [right]);
    }
    if (isArray(right))
        return compare([left], right);
    return left - right;
}

runDay(__dirname, { blankLines: 'group' }, input => {

    const pairs = input.map(lines => lines.map(line => JSON.parse(line)) as [Packet, Packet]);

    const indices = pairs.map(([left, right], index) => compare(left, right) < 0 ? index + 1 : null).filter(notNull);
    const indexSum = indices.reduce((a, b) => a + b, 0);

    const allPackets = pairs.flat();
    const divider1 = [[2]];
    const divider2 = [[6]];
    allPackets.push(divider1, divider2);
    allPackets.sort(compare);
    const decoderKey = (allPackets.indexOf(divider1) + 1) * (allPackets.indexOf(divider2) + 1);

    logResult({ indexSum, decoderKey });

});
