'use strict';

// Solutions for https://adventofcode.com/2022/day/3

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
                text,
                text.substring(0, text.length / 2),
                text.substring(text.length / 2),
            ]
        );
};


const calculateTotalScore = (strategy, rules) => {

    return strategy.reduce(
        (accumulator, move) => accumulator + rules[`${move[0]}${move[1]}`],
        0
    )
}

console.log(
    readInput()
);

console.log(
    'Solution for part one:',
);

console.log(
    'Solution for part two:',
);
