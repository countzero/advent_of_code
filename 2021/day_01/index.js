'use strict';

// Solutions for https://adventofcode.com/2021/day/1

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
 * Finds measurements that increase.
 *
 * @param {Array<Number>} measurements All measurements
 * @returns {Array<Number>} The result.
 */
const findMeasurementsThatIncrease = (measurements) => {

    const result = [];

    let previousMeasurement;

    measurements.forEach((measurement, index) => {

        if (index !== 0 && measurement > previousMeasurement) {
            result.push(measurement);
        }

        previousMeasurement = measurement;
    });

    return result;
};

console.log(
    'Solution for part one:',
    findMeasurementsThatIncrease(readInput(), 2020)
);
