import { dayLogger, jsonClone, logResult, runDay } from '../utils';

function parseStacks(stackLines: string[]) {
    const lastLine = stackLines.at(-1)!;
    const stackCount = lastLine.replace(/\s/g, '').length;
    const stacks: string[][] = Array.from({ length: stackCount }, () => []);
    for (let i = stackLines.length - 2; i >= 0; i--) {
        for (let j = 0; j < stackCount; j++) {
            const crate = stackLines[i].charAt(1 + j * 4);
            if (crate !== ' ')
                stacks[j].push(crate);
        }
    }
    return stacks;
}

function parseInstructions(instructionLines: string[]) {
    return instructionLines.map(line => {
        const values = [...line.matchAll(/\d+/g)].map(match => parseInt(match[0]));
        const [count, from, to] = values;
        return { count, from, to };
    });
}

function applyInstruction9000(stacks: string[][], instruction: ReturnType<typeof parseInstructions>[number]) {
    for (let i = 0; i < instruction.count; i++)
        stacks[instruction.to - 1].push(stacks[instruction.from - 1].pop()!);
}

function applyInstruction9001(stacks: string[][], instruction: ReturnType<typeof parseInstructions>[number]) {
    stacks[instruction.to - 1].push(...stacks[instruction.from - 1].splice(-instruction.count, instruction.count));
}

runDay(__dirname, { blankLines: 'group' }, input => {

    const stacks = parseStacks(input[0]);
    const instructions = parseInstructions(input[1]);
    dayLogger.debug('input', { stacks, instructions });

    const stacks2 = jsonClone(stacks);

    for (const instruction of instructions) {
        applyInstruction9000(stacks, instruction);
        applyInstruction9001(stacks2, instruction);
    }

    dayLogger.debug('intermediate', { stacks, stacks2 });

    const result1 = stacks.map(stack => stack.at(-1)!).join('');
    const result2 = stacks2.map(stack => stack.at(-1)!).join('');

    logResult({ result1, result2 });

});
