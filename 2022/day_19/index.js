'use strict';

// Solutions for https://adventofcode.com/2022/day/19

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<Object>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/)
        .slice(0, -1)

        // We are transforming the custom blueprint notation into a plain object.
        .map(line => {

            const values = line
                .match(/\d+/g)
                .map(value => parseInt(value, 10));

            const blueprint = {
                id: values[0],
                oreRobotCosts: [values[1], 0, 0],
                clayRobotCosts: [values[2], 0, 0],
                obsidianRobotCosts: [values[3], values[4], 0],
                geodeRobotCosts: [values[5], 0, values[6]],
            };

            return blueprint;
        })
};

console.log(
    readInput()[0]
);


console.log(
    'Solution for part one:'
);

console.log(
    'Solution for part two:'
);
