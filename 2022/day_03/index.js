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
        .slice(0, -1);
};

const findDuplicateItemInCompartments = inventory => {

    let duplicateItem;

    const firstCompartment = inventory.substring(0, inventory.length / 2).split('');
    const secondCompartment = inventory.substring(inventory.length / 2).split('');

    firstCompartment.every(item => {

        if (!secondCompartment.includes(item)) {
            return true;
        }

        duplicateItem = item;

        return false;
    });

    return duplicateItem;
};

const ascendingByLength = (a, b) => {

    if (a.length < b.length) {
        return 1;
    }

    if (a.length > b.length) {
        return -1;
    }

    return 0;
};

const findGroupItems = inventories => {

    let groupItems = [];
    let offset = 0;
    const step = 3;
    const max = inventories.length;

    while (offset < max) {

        const unqiueGroupItems = [
            [...new Set(inventories[offset])],
            [...new Set(inventories[offset + 1])],
            [...new Set(inventories[offset + 2])],
        ];

        unqiueGroupItems.sort(ascendingByLength);

        unqiueGroupItems[0].every(item => {

            if (!unqiueGroupItems[1].includes(item)) {
                return true;
            }

            if (!unqiueGroupItems[2].includes(item)) {
                return true;
            }

            groupItems.push(item);

            return false;
        });

        offset += step;
    }

    return groupItems;
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

const findDuplicateItemsInCompartments = inventories => inventories.map(
    inventory => findDuplicateItemInCompartments(inventory)
);

console.log(
    'Solution for part one:',
    calculateTotalPrioritiesOfItems(
        findDuplicateItemsInCompartments(readInput())
    )
);

console.log(
    'Solution for part two:',
    calculateTotalPrioritiesOfItems(
        findGroupItems(readInput())
    )
);
