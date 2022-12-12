import { dayLogger, logResult, notNull, runDay } from '../utils';

runDay(__dirname, {}, input => {

    const width = input[0].length;
    const height = input.length;
    const values = input.flatMap(line => [...line]);
    const start = values.indexOf('S');
    const end = values.indexOf('E');

    dayLogger.debug('input', { width, height, start, end });

    function getValue(node: number) {
        const value = values[node];
        if (value === 'S')
            return 1;
        if (value === 'E')
            return 26;
        return value.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }

    function getAdjecentNode(node: number, dx: number, dy: number) {
        const value = getValue(node);
        const x = node % width + dx;
        const y = ((node / width) | 0) + dy;
        if (x < 0 || y < 0 || x >= width || y >= height)
            return null;
        const node2 = y * width + x;
        const value2 = getValue(node2);
        if (value2 <= value + 1)
            return node2;
        return null;
    }

    const getAdjacent = (node: number) => [
        getAdjecentNode(node, -1, 0),
        getAdjecentNode(node, 1, 0),
        getAdjecentNode(node, 0, -1),
        getAdjecentNode(node, 0, 1)
    ].filter(notNull);

    const result = findShortestPath(values.length, start, end, getAdjacent);

    const results = [...values].map((value, index) => {
        if (value !== 'a' && value !== 'S')
            return null;
        return findShortestPath(values.length, index, end, getAdjacent);
    }).filter(notNull);

    const bestResult = Math.min(...results);

    logResult({ result, bestResult });

});

function findShortestPath(nodeCount: number, start: number, end: number, getAdjacent: (node: number) => number[]) {
    const dist: (number | null)[] = Array.from({ length: nodeCount }, () => null);
    const prev = new Map<number, number>();
    dist[start] = 0;
    prev.set(start, start);
    const q = new Set<number>(dist.keys());
    while (true) {
        const uList = [...q].filter(_q => dist[_q] !== null);
        if (uList.length === 0)
            break;
        const u = uList.reduce((min, _u) => dist[_u]! < dist[min]! ? _u : min);
        q.delete(u);
        const vs = getAdjacent(u).filter(v => q.has(v));
        for (const v of vs) {
            const alt = dist[u]! + 1;
            if (alt < (dist[v] ?? Infinity)) {
                dist[v] = alt;
                prev.set(v, u);
            }
        }
    }
    return dist[end];
}
