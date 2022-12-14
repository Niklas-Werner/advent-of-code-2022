import { BitArray, UnexpectedError } from '@nw55/common';
import { dayLogger, logResult, parseDecimalInt, runDay } from '../utils';

runDay(__dirname, {}, (input, { test }) => {

    const paths = input.map(line => line.split(' -> ').map(point => point.split(',').map(parseDecimalInt) as [number, number]));

    const startX = 500;
    const startY = 0;

    const minX = paths.flat().reduce((min, [x, y]) => Math.min(min, x), startX);
    const maxX = paths.flat().reduce((max, [x, y]) => Math.max(max, x), startX);
    const minY = paths.flat().reduce((min, [x, y]) => Math.min(min, y), startY);
    const maxY = paths.flat().reduce((max, [x, y]) => Math.max(max, y), startY);

    dayLogger.debug('input', { minX, maxX, minY, maxY });

    function run(floor: boolean) {
        dayLogger.verbose(`run: ${floor ? 'floor' : 'void'}`);

        const extraWidth = floor ? (test ? 10 : 130) : 1;

        const width = maxX - minX + 1 + 2 * extraWidth;
        const height = maxY - minY + 1 + (floor ? 2 : 1);
        const offsetX = minX - extraWidth;
        const offsetY = minY;

        dayLogger.debug('size', { width, height, offsetX, offsetY });

        const grid = new BitArray(width * height);

        function debugPrint() {
            console.log('DBG:');
            console.log(Array.from({ length: height }, (_, y) =>
                Array.from({ length: width }, (_, x) =>
                    grid.getUnchecked(y * width + x) ? '#' : '.'
                ).join('')
            ).join('\n'));
            console.log();
        }

        function getIndexChecked(x: number, y: number) {
            if (x - offsetX < 0 || x - offsetX >= width) {
                debugPrint();
                throw new UnexpectedError('need to increase extraWidth!');
            }
            return (y - offsetY) * width + (x - offsetX);
        }

        const set = (x: number, y: number) => grid.set(getIndexChecked(x, y));
        const get = (x: number, y: number) => grid.get(getIndexChecked(x, y));
        const abyss = (x: number, y: number) => y - offsetY >= height - 1;

        function fillLine([x1, y1]: [number, number], [x2, y2]: [number, number]) {
            const dx = Math.sign(x2 - x1);
            const dy = Math.sign(y2 - y1);
            for (let x = x1, y = y1; x !== x2 || y !== y2; x += dx, y += dy)
                set(x, y);
            set(x2, y2);
        }

        for (const path of paths) {
            for (let i = 1; i < path.length; i++)
                fillLine(path[i - 1], path[i]);
        }

        if (floor) {
            for (let x = 0; x < width; x++)
                grid.set((height - 1) * width + x);
        }

        // debugPrint();

        let count = 0;
        outer: while (true) {
            let x = startX;
            let y = startY;
            while (true) {
                if (get(x, y))
                    throw new UnexpectedError();
                if (!floor && abyss(x, y)) {
                    break outer;
                }
                else if (!get(x, y + 1)) {
                    y++;
                }
                else if (!get(x - 1, y + 1)) {
                    x--;
                    y++;
                }
                else if (!get(x + 1, y + 1)) {
                    x++;
                    y++;
                }
                else {
                    break;
                }
            }
            set(x, y);
            count++;
            if (floor && x === startX && y === startY)
                break;
        }
        return count;
    }

    const result1 = run(false);
    const result2 = run(true);

    logResult({ result1, result2 });

});
