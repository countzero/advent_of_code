'use strict';

// Solutions for https://adventofcode.com/2021/day/3

const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<string>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/);
};

/**
 * Calculates the gamma rate of the diagnostics report.
 *
 * @param {Array<string>} diagnostics The binary output of the diagnostics report.
 * @returns {Array<number>} The binary gamma rate.
 */
const getGammaRate = diagnostics => {

    const count = [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    diagnostics.forEach(entry => {

        for (let index = 0; index < entry.length; index++) {

            const bit = parseInt(entry.charAt(index), 2);

            count[bit][index]++;
        }
    });

    return count[0].map((lowBitCount, position) => count[1][position] > lowBitCount ? 1 : 0);
};

/**
 * Calculates the epsilon rate of the diagnostics report.
 *
 * @param {Array<String>} diagnostics The binary output of the diagnostics report.
 * @returns {Array<number>} The binary epsilon rate.
 */
const getEpsilonRate = diagnostics => getGammaRate(diagnostics).map(bit => 1 - bit);

/**
 * Counts the high and low bits at a specific position.
 *
 * @param {Array<string>} diagnostics The binary output of the diagnostics report.
 * @param {number} position The bit position in the binary number.
 * @returns {Array<number>} The count result.
 */
const countBits = (diagnostics, position) => {

    const count = [0,0];

    diagnostics.forEach(entry => {

        const bit = parseInt(entry.charAt(position), 2);

        if (isNaN(bit)) {
            return;
        }

        count[bit]++;
    });

    return count;
}

/**
 * Filters and reduces the entries by high or low bit priority.
 *
 * @param {Array<string>} diagnostics The binary output of the diagnostics report.
 * @param {number} priority The bit priority.
 * @returns {number} The decimal value of the final entry.
 */
const filterBits = (diagnostics, priority) => {

    const max = diagnostics[0].length;

    let items = diagnostics;

    for (let position = 0; position < max ; position++) {

        let count = countBits(items, position);

        let filterBit;

        if (priority === 1) {
            filterBit = count[1] >= count[0] ? 1 : 0;
        } else {
            filterBit = count[0] <= count[1] ? 0 : 1;
        }

        items = items.filter(entry => parseInt(entry.charAt(position), 2) === filterBit);

        if (items.length === 1) {
            break;
        }
    }

    return parseInt(items[0], 2);
}

console.log(
    'Solution for part one:',
    parseInt(getGammaRate(readInput()).join(''), 2) *
    parseInt(getEpsilonRate(readInput()).join(''), 2)
);

console.log(
    'Solution for part two:',
    filterBits(readInput(), 0) *
    filterBits(readInput(), 1)
);

