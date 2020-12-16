'use strict';

// Solutions for https://adventofcode.com/2020/day/1

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {String} relativeFilePath A file path relative to __dirname.
 * @param {String} encoding The input file encoding.
 * @returns {Array<Number>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
             .split(/\r?\n/)
             .map(text => parseInt(text, 10));
};

/**
 * Finds two numbers in a given array by their sum.
 *
 * @param {Array<Number>} items The potential terms.
 * @param {Number} sum The sum of the terms.
 * @returns {Array<Number>} The result.
 */
const findTwoNumbersByTheirSum = (items, sum) => {

    let result = [];

    items.some(firstTerm => {

        items.some(secondTerm => {

            const isMatching = firstTerm + secondTerm === sum;

            if (isMatching) {

                if (!result.includes(firstTerm)) {
                    result.push(firstTerm, secondTerm);
                }
            }

            return isMatching
        });
    });

    return result;
};

/**
 * Finds thre numbers in a given array by their sum.
 *
 * @param {Array<Number>} items The potential terms.
 * @param {Number} sum The sum of the terms.
 * @returns {Array<Number>} The result.
 */
const findThreeNumbersByTheirSum = (items, sum) => {

    let result = [];

    items.some(firstTerm => {

        items.some(secondTerm => {

            items.some(thirdTerm => {

                const isMatching = firstTerm + secondTerm + thirdTerm === sum;

                if (isMatching) {

                    if (!result.includes(firstTerm)) {
                        result.push(firstTerm, secondTerm, thirdTerm);
                    }
                }

                return isMatching
            });
        });
    });

    return result;
};

/**
 * Multiplies two factors.
 *
 * @param {Number} leftFactor The left factor.
 * @param {Number} leftFactor The right factor.
 * @returns {Number} The result.
 */
const multiply = (leftFactor, rightFactor) => leftFactor * rightFactor;

console.log(
    'Solution for part one:',
    findTwoNumbersByTheirSum(readInput(), 2020)
        .reduce(multiply)
);

console.log(
    'Solution for part two:',
    findThreeNumbersByTheirSum(readInput(), 2020)
        .reduce(multiply)
);
