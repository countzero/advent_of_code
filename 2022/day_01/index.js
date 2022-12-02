'use strict';

// Solutions for https://adventofcode.com/2022/day/1

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
        .map(text => parseInt(text, 10));
};

/**
 * Calculates the sum of all calories per elf.
 *
 * @param {Array<number>} inventory The raw inventory of all items.
 * @returns {Array<number>} Total calories per elf in descending order.
 */
const calculateTotalCaloriesPerElf = inventory => {

    const totalCaloriesPerElf = [];

    let caloriesSum = 0;

    inventory.forEach(
        item => {

            if (isNaN(item)) {
                totalCaloriesPerElf.push(caloriesSum);
                caloriesSum = 0;
                return;
            }

            caloriesSum += item;
        }
    )

    const descendingByValue = (a, b) => {

        if (a <= b) {
            return 1;
        }

        if (a => b) {
            return -1;
        }

        return 0;
    };

    totalCaloriesPerElf.sort(descendingByValue);

    return totalCaloriesPerElf;

};

console.log(
    'Solution for part one:',
    calculateTotalCaloriesPerElf(readInput())[0]
);

console.log(
    'Solution for part two:',
    calculateTotalCaloriesPerElf(readInput())[0] +
    calculateTotalCaloriesPerElf(readInput())[1] +
    calculateTotalCaloriesPerElf(readInput())[2]
);
