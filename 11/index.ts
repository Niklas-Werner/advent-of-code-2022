import { dayLogger, jsonClone, logResult, parseDecimalInt, runDay } from '../utils';

type Monkey = {
    items: number[];
    operation: '*' | '+';
    operand: number | 'old';
    test: number;
    ifTrue: number;
    ifFalse: number;
    inspections: number;
};

runDay(__dirname, { blankLines: 'group' }, input => {

    const monkeys = input.map<Monkey>(lines => {
        const items = lines[1].split(':')[1].split(',').map(parseDecimalInt);
        const operation = lines[2].includes('*') ? '*' : '+';
        const oprerandString = lines[2].split(operation)[1].trim();
        const operand = oprerandString === 'old' ? 'old' : parseInt(oprerandString);
        const [test, ifTrue, ifFalse] = lines.slice(3).map(line => parseInt(line.slice(line.lastIndexOf(' ') + 1)));
        return { items, operation, operand, test, ifTrue, ifFalse, inspections: 0 };
    });
    const monkeys2 = jsonClone(monkeys);

    const maxValue = monkeys.reduce((x, monkey) => x * monkey.test, 1);

    // dayLogger.debug(`maxValue: ${maxValue}`);
    // monkeys.forEach((monkey, index) => dayLogger.debug(`input monkey ${index}`, monkey));

    function doTurn(monkey: Monkey, monkeys: Monkey[], relief: boolean) {
        while (monkey.items.length > 0) {
            let worryLevel = monkey.items.shift()!;
            monkey.inspections++;
            let operand = monkey.operand === 'old' ? worryLevel : monkey.operand;
            if (monkey.operation === '*')
                worryLevel *= operand;
            else
                worryLevel += operand;
            if (relief)
                worryLevel = Math.floor(worryLevel / 3);
            worryLevel %= maxValue;
            const destination = worryLevel % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
            monkeys[destination].items.push(worryLevel);
        }
    }

    function doRound(monkeys: Monkey[], relief: boolean) {
        for (const monkey of monkeys)
            doTurn(monkey, monkeys, relief);
    }

    function getMonkeyBusiness(monkeys: Monkey[]) {
        const [first, second] = monkeys.map(monkey => monkey.inspections).sort((a, b) => b - a);
        return first * second;
    }

    for (let i = 0; i < 20; i++)
        doRound(monkeys, true);

    // monkeys.forEach((monkey, index) => dayLogger.debug(`after 20 rounds: monkey ${index}`, monkey));

    for (let i = 0; i < 10000; i++) {
        doRound(monkeys2, false);
        if (i === 0 || i === 19 || (i + 1) % 1000 === 0) {
            // monkeys2.forEach((monkey, index) => dayLogger.debug(`after ${i + 1} rounds: monkey ${index}`, monkey));
        }
    }

    const result1 = getMonkeyBusiness(monkeys);
    const result2 = getMonkeyBusiness(monkeys2);

    logResult({ result1, result2 });

});
