import { dayLogger, logResult, parseDecimalInt, runDay } from '../utils';

const directions = [
    [-1, 0], [1, 0], [0, 1], [0, -1]
];

runDay(__dirname, {}, input => {

    const grid = input.map(line => line.split('').map(parseDecimalInt));

    function isVisible(x0: number, y0: number, dx: number, dy: number) {
        let x = x0 + dx;
        let y = y0 + dy;
        let viewDistance = 0;
        while (x >= 0 && x < grid.length && y >= 0 && y < grid[x].length) {
            viewDistance++;
            if (grid[x][y] >= grid[x0][y0])
                return [false, viewDistance] as const;
            x += dx;
            y += dy;
        }
        return [true, viewDistance] as const;
    }

    let visibleCount = 0;
    let bestScore = 0;
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            let anyDirectionVisible = false;
            let scenicScore = 1;
            for (const [dx, dy] of directions) {
                const [visible, viewDistance] = isVisible(x, y, dx, dy);
                anyDirectionVisible ||= visible;
                scenicScore *= viewDistance;
            }
            if (anyDirectionVisible)
                visibleCount++;
            bestScore = Math.max(bestScore, scenicScore);
        }
    }

    logResult({ visibleCount, bestScore });

});
