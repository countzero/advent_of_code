'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Reads an intcode program from a file into an array.
 *
 * @see https://adventofcode.com/2019/day/2
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {array} The gravity assist program.
 */
const readIntcodeProgram = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
           .split(/,/)
           .map(text => parseInt(text, 10));
};

/**
 * Computes a given intcode program.
 *
 * @param {array} program A gravity assist program.
 * @param {string} encoding The input file encoding.
 * @returns {array} The gravity assist program.
 */
const compute = (program, position = 0) => {

    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;

    const operationCode = program[position];
    const a = program[program[position + 1]];
    const b = program[program[position + 2]];
    const resultPosition = program[position + 3];
    const nextPosition = position + 4;

    switch (operationCode) {

        case 1:

            program[resultPosition] = add(a, b);
            return compute(program, nextPosition);

        case 2:

            program[resultPosition] = multiply(a, b);
            return compute(program, nextPosition);

        case 99:

            return program;
    }
}

/**
 * Restores the 1202 program alarm state in a given intcode program.
 *
 * @param {array} program An intcode program.
 * @returns {array} The modified intcode program.
 */
const restoreProgramAlarmState = program => {

    program[1] = 12;
    program[2] = 2;

    return program;
};


console.log(
    'Solution for part one:',
    compute(
        restoreProgramAlarmState(
            readIntcodeProgram()
        )
    )[0]
);
