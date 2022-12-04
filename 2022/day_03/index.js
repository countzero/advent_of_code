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
                text.substring(0, text.length / 2).split(''),
                text.substring(text.length / 2).split(''),
            ]
        );
};

const findDuplicateItem = inventory => {

    const duplicates = [];

    inventory[0].forEach(item => {

        if (!inventory[1].includes(item)) {
            return;
        }

        if (duplicates.includes(item)) {
            return;
        }

        duplicates.push(item);
    });

    return duplicates[0];
};

const getUnicodeCharacters = (start, length) => {

    return Array
        .from(Array(length))
        .map(
            (item, index) => String.fromCharCode(index + start)
        )
}

const getLowerCaseAlphabet = () => getUnicodeCharacters(97, 26);

const getUpperCaseAlphabet = () => getUnicodeCharacters(65, 26);

const calculateTotalPrioritiesOfItems = items => {

    const itemsPriority = (new Array(1)).concat(
        getLowerCaseAlphabet(),
        getUpperCaseAlphabet()
    );

    return items.reduce(
        (accumulator, item) => accumulator + itemsPriority.indexOf(item),
        0
    )
};

const findDuplicateItems = inventories => inventories.map(
    inventory => findDuplicateItem(inventory)
);

console.log(
    'Solution for part one:',
    calculateTotalPrioritiesOfItems(
        findDuplicateItems(readInput())
    )
);

console.log(
    'Solution for part two:',
);
