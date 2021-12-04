'use strict';

// Solutions for https://adventofcode.com/2021/day/2

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<string>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/);
};

/**
 * Calculates the final position of all consecutive course commands.
 *
 * @param {Array<String>} commands All course commands.
 * @returns {Object} position The final position.
 * @returns {number} position.x The horizontal position on the x-axis.
 * @returns {number} position.y The horizontal position on the y-axis.
 * @returns {number} position.z The vertical position on the z-axis (depth).
 */
const calculateFinalPosition = commands => {

    let x = 0;
    let y = 0;
    let z = 0;

    commands.forEach(command => {

        const direction = command.split(' ')[0];
        const length = parseInt(command.split(' ')[1], 10);

        switch (direction) {

            case 'forward':
                x += length;
                break;

            case 'down':
                z += length;
                break;

            case 'up':
                z -= length;
                break;
        }
    });

    return {
        x,
        y,
        z,
    };
};

/**
 * Calculates the final position of all consecutive course commands.
 *
 * @param {Array<String>} commands All course commands.
 * @returns {Object} position The final position.
 * @returns {number} position.x The horizontal position on the x-axis.
 * @returns {number} position.y The horizontal position on the y-axis.
 * @returns {number} position.z The vertical position on the z-axis (depth).
 */
const calculateFinalPositionWithAim = commands => {

    let aim = 0;
    let x = 0;
    let y = 0;
    let z = 0;

    commands.forEach(command => {

        const direction = command.split(' ')[0];
        const length = parseInt(command.split(' ')[1], 10);

        switch (direction) {

            case 'forward':
                x += length;
                z += aim * length;
                break;

            case 'down':
                aim += length;
                break;

            case 'up':
                aim -= length;
                break;
        }
    });

    return {
        x,
        y,
        z,
    };
};

console.log(
    'Solution for part one:',
    calculateFinalPosition(readInput()).x * calculateFinalPosition(readInput()).z
);

console.log(
    'Solution for part two:',
    calculateFinalPositionWithAim(readInput()).x * calculateFinalPositionWithAim(readInput()).z
);
