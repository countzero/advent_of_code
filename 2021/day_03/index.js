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

console.log(
    'Solution for part one:',
    parseInt(getGammaRate(readInput()).join(''), 2) *
    parseInt(getEpsilonRate(readInput()).join(''), 2)
);
