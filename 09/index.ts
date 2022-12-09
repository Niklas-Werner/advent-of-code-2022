import { dayLogger, logResult, runDay, splitOnce } from '../utils';

const directions: Record<string, [number, number]> = {
    'L': [-1, 0],
    'R': [1, 0],
    'U': [0, -1],
    'D': [0, 1]
};

function print(w: number, h: number, sx: number, sy: number, rope: [number, number][]) {
    const result = Array.from({ length: h }, () => Array.from({ length: w }, () => '.'));
    result[sy][sx] = 's';
    for (let i = rope.length - 1; i >= 0; i--)
        result[rope[i][1] + sy][rope[i][0] + sx] = i === 0 ? 'H' : String(i);
    console.info(result.map(line => line.join('')).join('\n'));
    console.info();
}

runDay(__dirname, {}, (input, { test }) => {

    const motions = input.map(splitOnce(' ')).map(([direction, steps]) => [directions[direction], parseInt(steps)] as const);

    function simulate(ropeLength: number) {
        dayLogger.verbose(`simulate(${ropeLength})`);

        const rope: [number, number][] = [];
        for (let i = 0; i <= ropeLength; i++)
            rope.push([0, 0]);

        const tailPositions = new Set<string>();
        tailPositions.add('0,0');

        for (const [[dx, dy], steps] of motions) {
            for (let s = 0; s < steps; s++) {
                rope[0][0] += dx;
                rope[0][1] += dy;
                for (let i = 1; i <= ropeLength; i++) {
                    if (Math.abs(rope[i - 1][0] - rope[i][0]) >= 2 || Math.abs(rope[i - 1][1] - rope[i][1]) >= 2) {
                        rope[i][0] += Math.sign(rope[i - 1][0] - rope[i][0]);
                        rope[i][1] += Math.sign(rope[i - 1][1] - rope[i][1]);
                    }
                }
                tailPositions.add(`${rope[ropeLength][0]},${rope[ropeLength][1]}`);
                // if (test === 1)
                //     print(6, 5, 0, 4, rope);
            }
            // if (test === 2)
            //     print(26, 21, 11, 15, rope);
        }

        return tailPositions.size;
    }

    const result1 = simulate(1);
    const result2 = simulate(9);

    logResult({ result1, result2 });

});
