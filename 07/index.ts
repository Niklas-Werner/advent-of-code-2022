import { UnexpectedError } from '@nw55/common';
import { dayLogger, logResult, runDay } from '../utils';

type Entry = {
    name: string;
    size: number;
    dir: boolean;
    entries: Entry[];
    parent: Entry | null;
};

function calculateDirSizes(entry: Entry) {
    if (!entry.dir)
        return entry.size;
    let sum = 0;
    for (const subEntry of entry.entries)
        sum += calculateDirSizes(subEntry);
    entry.size = sum;
    return sum;
}

function* iterateEntries(entry: Entry): IterableIterator<Entry> {
    yield entry;
    for (const subEntry of entry.entries)
        yield* iterateEntries(subEntry);
}

runDay(__dirname, {}, input => {

    const root: Entry = { name: '/', size: 0, dir: true, entries: [], parent: null };

    let currentDir = root;

    for (const line of input) {
        // dayLogger.verbose(`> ${line}`);
        if (line.startsWith('$')) {
            const command = line.slice(2);
            if (command.startsWith('cd')) {
                const dirName = command.slice(3);
                if (dirName === '/') {
                    currentDir = root;
                }
                else if (dirName === '..') {
                    if (currentDir.parent === null)
                        throw new UnexpectedError();
                    currentDir = currentDir.parent;
                }
                else {
                    const dir = currentDir.entries.find(entry => entry.name === dirName);
                    if (!dir || !dir.dir)
                        throw new UnexpectedError();
                    currentDir = dir;
                }
            }
        }
        else {
            const [sizeOrType, name] = line.split(' ');
            if (currentDir.entries.some(entry => entry.name === name))
                throw new UnexpectedError();
            if (sizeOrType === 'dir')
                currentDir.entries.push({ name, size: 0, dir: true, entries: [], parent: currentDir });
            else
                currentDir.entries.push({ name, size: parseInt(sizeOrType), dir: false, entries: [], parent: currentDir });
        }
    }

    calculateDirSizes(root);

    const allDirs = [...iterateEntries(root)].filter(entry => entry.dir);

    const smallDirs = allDirs.filter(entry => entry.size < 100000);
    const smallDirSum = smallDirs.reduce((sum, dir) => sum + dir.size, 0);

    const unused = 70000000 - root.size;
    const required = 30000000 - unused;

    dayLogger.debug('sizes', { used: root.size, unused, required });

    const options = allDirs.filter(entry => entry.size > required);
    const bestOption = options.reduce((min, dir) => Math.min(min, dir.size), Infinity);

    logResult({ smallDirSum, bestOption });

});
