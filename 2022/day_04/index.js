'use strict';

// Solutions for https://adventofcode.com/2022/day/4

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
            line => line
                .replace(',', '-')
                .split('-')
                .map(Number)
        );
};

const findAssignmentPairsWithFullOverlap = assignmentPairs => assignmentPairs.filter(
    ids => (ids[0] - ids[2]) * (ids[1] - ids[3]) <= 0
);

console.log(
    'Solution for part one:',
    findAssignmentPairsWithFullOverlap(
        readInput()
    ).length
);

console.log(
    'Solution for part two:',

);
