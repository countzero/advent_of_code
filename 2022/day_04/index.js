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

    ([firstStart, firstEnd, secondStart, secondEnd]) => {

        const firstAssignmentContainsSecond = secondStart >= firstStart && secondEnd <= firstEnd;
        const secondAssignmentContainsFirst = firstStart >= secondStart && firstEnd <= secondEnd;

        return firstAssignmentContainsSecond || secondAssignmentContainsFirst;
    }
);

const findAssignmentPairsWithPartialOverlap = assignmentPairs => assignmentPairs.filter(

    ([firstStart, firstEnd, secondStart, secondEnd]) => {

        const secondAssignmentOverlapsFirst = secondStart <= firstEnd && secondStart >= firstStart;
        const firstAssignmentOverlapsSecond = firstStart <= secondEnd && firstStart >= secondStart;

        return secondAssignmentOverlapsFirst || firstAssignmentOverlapsSecond;
    }
);

console.log(
    'Solution for part one:',
    findAssignmentPairsWithFullOverlap(
        readInput()
    ).length
);

console.log(
    'Solution for part two:',
    findAssignmentPairsWithPartialOverlap(
        readInput()
    ).length
);
