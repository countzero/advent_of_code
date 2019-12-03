'use strict';

// Solutions for https://adventofcode.com/2019/day/1

const fs = require('fs');
const path = require('path');

/**
 * Calculates the total fuel requirements for santa.
 *
 * @param {function} calculateFuel The fuel calculation algorithm.
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {number} The total fuel requirements for all modules.
 */
const calculateTotalFuelRequirements = (calculateFuel, relativeFilePath = './input.txt', encoding = 'utf8') => {

    const moduleMasses = fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
                         .split(/\r?\n/)
                         .map(text => parseInt(text, 10));

    return moduleMasses.reduce(
        (accumulator, moduleMass) => accumulator + calculateFuel(moduleMass),
        0
    );
};

/**
 * Calculates the fuel requirements for a given mass.
 *
 * @param {number} mass The module mass.
 * @returns {number} The fuel requirements for that mass.
 */
const calculateFuelForMass = mass => Math.floor(mass / 3) - 2;

/**
 * Calculates the fuel recursively.
 *
 * @param {number} mass A given mass.
 * @param {number} result The total fuel requirements.
 * @returns {number} The total fuel requirements.
 */
const calculateFuelRecursively = (mass, result = 0) => {

    if (calculateFuelForMass(mass) <= 0) {
        return result;
    }

    return calculateFuelRecursively(
        calculateFuelForMass(mass),
        result + calculateFuelForMass(mass)
    );
};

console.log(
    'Solution for part one:',
    calculateTotalFuelRequirements(calculateFuelForMass)
);

console.log(
    'Solution for part two:',
    calculateTotalFuelRequirements(calculateFuelRecursively)
);
