'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Calculate the fuel requirements for santa.
 *
 * @see https://adventofcode.com/2019/day/1
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {number} The total fuel requirements for all modules.
 */
const calculateFuelRequirements = (relativeFilePath, encoding = 'utf8') => {

    const moduleMasses = fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
                         .split(/\r?\n/)
                         .map(text => parseInt(text, 10));

    const calculateFuel = mass => Math.floor(mass / 3) - 2;

    return moduleMasses.reduce(
        (accumulator, moduleMass) => accumulator + calculateFuel(moduleMass),
        0
    );
};

const totalFuelRequirements = calculateFuelRequirements('./input.txt');

console.log(totalFuelRequirements);
