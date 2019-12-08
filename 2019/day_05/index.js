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

/**
 * Gets the operation handler by its operation code.
 *
 * @param {number} operationCode The operation code.
 * @returns {object} The operation handler.
 */
const getOperationHandler = operationCode => {

    const operation = [
        {
            code: 1,
            name: 'add',
            getModifiedProgram: (input, program, position, output) => {

                program[getParameterValuePosition(program, position, 3)] = add(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                );

                return program;
            },
            getNextPosition: position => position + 4,
            getExtendedOutput: (input, program, position, output) => output,
        },

        {
            code: 2,
            name: 'multiply',
            getModifiedProgram: (input, program, position, output) => {

                program[getParameterValuePosition(program, position, 3)] = multiply(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                );

                return program;
            },
            getNextPosition: position => position + 4,
            getExtendedOutput: (input, program, position, output) => output,
        },

        {
            code: 3,
            name: 'input',
            getModifiedProgram: (input, program, position, output) => {

                program[getParameterValuePosition(program, position, 1)] = input;

                return program;
            },
            getNextPosition: position => position + 2,
            getExtendedOutput: (input, program, position, output) => output,
        },

        {
            code: 4,
            name: 'output',
            getModifiedProgram: (input, program, position, output) => program,
            getNextPosition: position => position + 2,
            getExtendedOutput: (input, program, position, output) => {

                output.push(
                    program[getParameterValuePosition(program, position, 1)]
                );

                return output;
            },
        },

        {
            code: 99,
            name: 'halt',
            getModifiedProgram: (input, program, position, output) => program,
            getNextPosition: position => position,
            getExtendedOutput: (input, program, position, output) => output,
        },

    ].find(operation => operation.code === operationCode)

    if (typeof operation == 'undefined') {

        throw new Error(`Unknown operation code '${operationCode}': The operation is not implemented.`)
    }

    return operation;
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

    const operationCode = getOperationCode(program[position]);
    const operation = getOperationHandler(operationCode);

    if (operation.name === 'halt') {

        return {
            program: operation.getModifiedProgram(input, program, position, output),
            output: operation.getExtendedOutput(input, program, position, output),
        };
    }

    return compute(
        input,
        operation.getModifiedProgram(input, program, position, output),
        operation.getNextPosition(position),
        operation.getExtendedOutput(input, program, position, output)
    )
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

console.log(
    'Solution for part two:',
    readDiagnosticCode(
        compute(
            5,
            readIntcodeProgram()
        )
    )
);
