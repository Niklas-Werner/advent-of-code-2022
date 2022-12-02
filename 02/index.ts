import { dayLogger, logResult, runDay } from '../utils';

const shapes = ['r', 'p', 's'] as const;
type Shape = typeof shapes[number];
const outcomes = ['l', 'd', 'w'] as const;
type Outcome = typeof outcomes[number];

const winsAgainstMapping: Record<Shape, Shape> = {
    'r': 's',
    'p': 'r',
    's': 'p'
};

function getOutcome(player: Shape, opponent: Shape): Outcome {
    if (player === opponent)
        return 'd';
    if (winsAgainstMapping[player] === opponent)
        return 'w';
    return 'l';
}

function getShape(outcome: Outcome, opponent: Shape): Shape {
    if (outcome === 'd')
        return opponent;
    if (outcome === 'l')
        return winsAgainstMapping[opponent];
    return shapes.find(shape => winsAgainstMapping[shape] === opponent)!;
}

const shapeScores: Record<Shape, number> = {
    'r': 1,
    'p': 2,
    's': 3
};

const outcomeScores: Record<Outcome, number> = {
    'l': 0,
    'd': 3,
    'w': 6
};

function parseInputLine(line: string): { opponent: Shape; playerShape: Shape; playerOutcome: Outcome; } {
    const opponent = shapes[line.charCodeAt(0) - 'A'.charCodeAt(0)];
    const playerShape = shapes[line.charCodeAt(2) - 'X'.charCodeAt(0)];
    const playerOutcome = outcomes[line.charCodeAt(2) - 'X'.charCodeAt(0)];
    return { opponent, playerShape, playerOutcome };
}

runDay(__dirname, {}, input => {

    const rounds = input.map(parseInputLine);

    let score1 = 0;
    let score2 = 0;
    for (const { opponent, playerShape, playerOutcome } of rounds) {
        const outcomeFromShape = getOutcome(playerShape, opponent);
        score1 += shapeScores[playerShape];
        score1 += outcomeScores[outcomeFromShape];

        const shapeFromOutcome = getShape(playerOutcome, opponent);
        score2 += shapeScores[shapeFromOutcome];
        score2 += outcomeScores[playerOutcome];
    }

    logResult({ score1, score2 });

});
