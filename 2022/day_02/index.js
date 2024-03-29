'use strict';

// Solutions for https://adventofcode.com/2022/day/2

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<Number>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/)
        .slice(0, -1)
        .map(
            text => [
                text.split(' ')[0],
                text.split(' ')[1],
            ]
        );
};

const getDefaultGameRules = () => {

    return {
        'BX': 1, // Paper vs. Rock
        'CY': 2, // Scissor vs. Paper
        'AZ': 3, // Rock vs. Scissor
        'AX': 4, // Rock vs. Rock
        'BY': 5, // Paper vs. Paper
        'CZ': 6, // Scissor vs. Scissor
        'CX': 7, // Scissor vs. Rock
        'AY': 8, // Rock vs. Paper
        'BZ': 9, // Paper vs. Scissor
    }
};

const getSpecialGameRules = () => {

    return {
        'BX': 1, // We need to loose vs. Paper = Rock
        'CX': 2, // We need to loose vs. Scissor = Paper
        'AX': 3, // We need to loose vs. Rock = Scissor
        'AY': 4, // We need to draw vs. Rock = Rock
        'BY': 5, // We need to draw vs. Paper = Paper
        'CY': 6, // We need to draw vs. Scissor = Scissor
        'CZ': 7, // We need to win vs. Scissor = Rock
        'AZ': 8, // We need to win vs. Rock = Paper
        'BZ': 9, // We need to win vs. Paper = Scissor
    }
};

const calculateTotalScore = (strategy, rules) => {

    return strategy.reduce(
        (accumulator, move) => accumulator + rules[`${move[0]}${move[1]}`],
        0
    )
}

console.log(
    'Solution for part one:',
    calculateTotalScore(
        readInput(),
        getDefaultGameRules()
    )
);

console.log(
    'Solution for part two:',
    calculateTotalScore(
        readInput(),
        getSpecialGameRules()
    )
);
