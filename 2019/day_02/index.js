'use strict';

// Solutions for https://adventofcode.com/2019/day/2

const fs = require('fs');
const path = require('path');

/**
 * Adds two values.
 *
 * @param {number} a The first value
 * @param {number} b The second value
 * @returns {number} The result.
 */
const add = (a, b) => a + b;

/**
 * Multiplies two values.
 *
 * @param {number} a The first value
 * @param {number} b The second value
 * @returns {number} The result.
 */
const multiply = (a, b) => a * b;

/**
 * Reads an intcode program from a file into an array.
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
 * Sets a program state by changing the input.
 *
 * @param {array} program An intcode program.
 * @param {number} noun The input noun.
 * @param {number} verb The input verb.
 * @returns {array} The modified intcode program.
 */
const setProgramState = (program, noun, verb) => {

    program[1] = noun;
    program[2] = verb;

    return program;
};

/**
 * Computes a given intcode program.
 *
 * @param {array} program A gravity assist program.
 * @param {number} position The instruction pointer.
 * @returns {array} The computed gravity assist program.
 */
const compute = (program, position = 0) => {

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
 * Reads the result of a computed intcode program.
 *
 * @param {array} program A computed intcode program.
 * @returns {number} The result of the program execution.
 */
const readProgramResult = program => program[0];

/**
 * Finds the program input for a given output by brute force.
 *
 * @param {array} program A computed intcode program.
 * @param {number} output The expected output.
 * @returns {number} The noun multiplied by 100 plus the verb.
 */
const findInputByBruteForce = (program, output) => {

    const upperBoundary = 99;
    let programResult;

    for (let noun = 0; noun <= upperBoundary; noun++) {

        for (let verb = 0; verb <= upperBoundary; verb++) {

            programResult = readProgramResult(
                compute(
                    setProgramState(readIntcodeProgram(), noun, verb)
                )
            );

            if (programResult === output) {

                return add(multiply(100, noun), verb);
            }
        }
    }

    return 0;
}

console.log(
    'Solution for part one:',
    readProgramResult(
        compute(
            setProgramState(readIntcodeProgram(), 12, 2)
        )
    )
);

console.log(
    'Solution for part two:',
    findInputByBruteForce(readIntcodeProgram(), 19690720)
);
