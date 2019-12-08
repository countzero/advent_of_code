'use strict';

// Solutions for https://adventofcode.com/2019/day/5

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
 * Gets the operation code from a given instruction.
 *
 * The operation code are the two rightmost numbers of an instruction.
 *
 * @param {number} instruction The intcode instruction number containing the operation code.
 * @returns {number} The operation code.
 */
const getOperationCode = instruction => {

    return parseInt(
        instruction.toString().substr(-2, 2),
        10
    );
}

/**
 * Gets the mode for a parameter position.
 *
 *     0 = position mode (default)
 *     1 = immediate mode
 *
 * @param {number} instruction The intcode instruction number containing the optional parameter position modes.
 * @param {number} parameterPositionOffset The parameter position offset from the instruction.
 * @returns {number} The position mode of a specific parameter.
 */
const getModeForParameterPosition = (instruction, parameterPositionOffset) => {

    const modes = [0, 1];

    const mode = parseInt(
        instruction.toString().split('').reverse()[parameterPositionOffset + 1],
        10
    );

    if (!modes.includes(mode)) {
        return modes[0];
    }

    return mode;
}

/**
 * Gets the parameter value position, which differs in relation to the parameter mode.
 *
 * @param {array} program An intcode program.
 * @param {number} position The current program execution pointer position.
 * @param {number} parameterPositionOffset The parameter position offset from the instruction.
 * @returns {number} The position of the parameter value.
 */
const getParameterValuePosition = (program, position, parameterPositionOffset) => {

    const instruction = program[position];

    switch (getModeForParameterPosition(instruction, parameterPositionOffset)) {

        case 0:

            return program[position + parameterPositionOffset];

        case 1:

            return position + parameterPositionOffset;
    }

    throw new Error('Unknown parameter position mode.');
}

const addOperation = {

    execute: (program, position) => {

        program[getParameterValuePosition(program, position, 3)] = add(
            program[getParameterValuePosition(program, position, 1)],
            program[getParameterValuePosition(program, position, 2)]
        );

        return program;
    },

    getNextPosition: position => position + 4,
}

const multiplyOperation = {

    execute: (program, position) => {

        program[getParameterValuePosition(program, position, 3)] = multiply(
            program[getParameterValuePosition(program, position, 1)],
            program[getParameterValuePosition(program, position, 2)]
        );

        return program;
    },

    getNextPosition: position => position + 4,
}

const inputOperation = {

    execute: (input, program, position) => {

        program[getParameterValuePosition(program, position, 1)] = input;

        return program;
    },

    getNextPosition: position => position + 2,
}

const outputOperation = {

    execute: program => program,
    getOutput: (program, position, output) => {

        output.push(
            program[getParameterValuePosition(program, position, 1)]
        );

        return output;
    },
    getNextPosition: position => position + 2,
}

/**
 * Computes a given intcode program.
 *
 * @param {number} input The program input.
 * @param {array} program An intcode program.
 * @param {number} position The program pointer position.
 * @param {array} output The program output log.
 * @returns {object} The compute result.
 */
const compute = (input, program, position = 0, output = []) => {

    switch (getOperationCode(program[position])) {

        case 1:

            return compute(
                input,
                addOperation.execute(program, position),
                addOperation.getNextPosition(position),
                output
            )

        case 2:

            return compute(
                input,
                multiplyOperation.execute(program, position),
                multiplyOperation.getNextPosition(position),
                output
            )

        case 3:

            return compute(
                input,
                inputOperation.execute(input, program, position),
                inputOperation.getNextPosition(position),
                output
            )

        case 4:

            return compute(
                input,
                outputOperation.execute(program),
                outputOperation.getNextPosition(position),
                outputOperation.getOutput(program, position, output)
            )

        case 99:

            return {
                program,
                output
            };
    }
}

/**
 * Read the diagnostic code from the output log.
 *
 * @param {object} computeResult The compute result.
 * @returns {number} The diagnostic result.
 */
const readDiagnosticCode = computeResult => computeResult.output.pop();

console.log(
    'Solution for part one:',
    readDiagnosticCode(
        compute(
            1,
            readIntcodeProgram()
        )
    )
);
