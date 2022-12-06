import { logResult, runDay } from '../utils';

function findMarker(input: string, length: number) {
    for (let i = length; i <= input.length; i++) {
        if (new Set(input.slice(i - length, i)).size === length)
            return i;
    }
}

runDay(__dirname, {}, input => {
    for (const line of input) {

        const marker1Pos = findMarker(line, 4);
        const marker2Pos = findMarker(line, 14);

        logResult({ marker1Pos, marker2Pos });

    }
});
