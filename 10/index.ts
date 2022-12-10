import { dayLogger, logResult, runDay } from '../utils';

runDay(__dirname, {}, input => {

    const instructions = input.map(line => line === 'noop' ? null : parseInt(line.split(' ')[1]));

    let register = 1;
    let cycle = 1;

    let result1 = 0;
    const screen: boolean[] = [];

    function performCycle(value?: number) {
        const pixel = Math.abs((cycle - 1) % 40 - register) <= 1;
        screen.push(pixel);
        // dayLogger.trace(`cycle ${cycle}: ${register} -> pixel ${pixel}`);
        if ((cycle - 20) % 40 === 0) {
            // dayLogger.debug('interesting', { cycle, register });
            result1 += cycle * register;
        }
        if (value !== undefined)
            register = value;
        cycle++;
    }

    for (const instruction of instructions) {
        // dayLogger.trace(`instruction: ${instruction}`);
        if (instruction === null) {
            performCycle();
        }
        else {
            performCycle();
            performCycle(register + instruction);
        }
    }

    const screenStrings = screen.map(pixel => pixel ? '#' : '.').join('').match(/.{1,40}/g);
    logResult({ result1, screenStrings });

});
