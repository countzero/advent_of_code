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
 * Finds measurement groups that increase relative to the previous measurement group.
 *
 * @param {Array<Number>} measurements All raw measurement data points.
 * @param {Number} groupSize The size of the measurement group.
 * @returns {Array<Number>} All measurement data points that increase.
 */
const findIncreasingMeasurementGroups = (measurements, groupSize = 1) => {

    const result = [];

    let previousMeasurement;

    measurements.forEach((measurement, index) => {

        let iteration = groupSize;
        let measurementSum = 0;

        while (iteration--) {
            measurementSum += measurements[index + iteration];
        }

        if (index !== 0 && measurementSum > previousMeasurement) {
            result.push(measurementSum);
        }

        previousMeasurement = measurementSum;
    });

    return result;
};

console.log(
    'Solution for part one:',
    findIncreasingMeasurementGroups(readInput()).length
);

console.log(
    'Solution for part two:',
    findIncreasingMeasurementGroups(readInput(), 3).length
);
