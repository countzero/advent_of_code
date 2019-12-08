'use strict';

// Solutions for https://adventofcode.com/2019/day/5

const fs = require('fs');
const path = require('path');

/**
 * Reads an universal orbit map into an array.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {array<array<string>>} The universal orbit map.
 */
const readUniversalOrbitMap = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
           .split(/\n/)
           .map(relationship => relationship.split(/\)/));
};

console.log(readUniversalOrbitMap);

console.log(
    'Solution for part one:',
    0
);
