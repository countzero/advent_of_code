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
 * Checks if the first value is less than the second value.
 *
 * @param {number} a The first value
 * @param {number} b The second value
 * @returns {number} The result.
 */
const isLess = (a, b) => a < b;

/**
 * Checks if the first value equals the second value.
 *
 * @param {number} a The first value
 * @param {number} b The second value
 * @returns {number} The result.
 */
const equals = (a, b) => a === b;

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
            getModifiedProgram: context => {

                const {
                    program,
                    position,
                } = context;

                program[getParameterValuePosition(program, position, 3)] = add(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                );

                return program;
            },
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position + 4,
        },

        {
            code: 2,
            name: 'multiply',
            getModifiedProgram: context => {

                const {
                    program,
                    position,
                } = context;

                program[getParameterValuePosition(program, position, 3)] = multiply(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                );

                return program;
            },
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position + 4,
        },

        {
            code: 3,
            name: 'input',
            getModifiedProgram: context => {

                const {
                    input,
                    program,
                    position,
                } = context;

                program[getParameterValuePosition(program, position, 1)] = input;

                return program;
            },
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position + 2,
        },

        {
            code: 4,
            name: 'output',
            getModifiedProgram: context => context.program,
            getExtendedOutput: context => {

                const {
                    program,
                    position,
                    output,
                } = context;

                output.push(
                    program[getParameterValuePosition(program, position, 1)]
                );

                return output;
            },
            getNextPosition: context => context.position + 2,
        },

        {
            code: 5,
            name: 'jumpIfTrue',
            getModifiedProgram: context => context.program,
            getExtendedOutput: context => context.output,
            getNextPosition: context => {

                const {
                    program,
                    position,
                } = context;

                if (program[getParameterValuePosition(program, position, 1)] !== 0) {

                    return program[getParameterValuePosition(program, position, 2)];
                }

                return position + 3;
            },
        },

        {
            code: 6,
            name: 'jumpIfFalse',
            getModifiedProgram: context => context.program,
            getExtendedOutput: context => context.output,
            getNextPosition: context => {

                const {
                    program,
                    position,
                } = context;

                if (program[getParameterValuePosition(program, position, 1)] === 0) {

                    return program[getParameterValuePosition(program, position, 2)];
                }

                return position + 3;
            },
        },

        {
            code: 7,
            name: 'lessThan',
            getModifiedProgram: context => {

                const {
                    program,
                    position,
                } = context;

                program[getParameterValuePosition(program, position, 3)] = isLess(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                ) ? 1 : 0;

                return program;
            },
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position + 4,
        },

        {
            code: 8,
            name: 'equals',
            getModifiedProgram: context => {

                const {
                    program,
                    position,
                } = context;

                program[getParameterValuePosition(program, position, 3)] = equals(
                    program[getParameterValuePosition(program, position, 1)],
                    program[getParameterValuePosition(program, position, 2)]
                ) ? 1 : 0;

                return program;
            },
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position + 4,
        },

        {
            code: 99,
            name: 'halt',
            getModifiedProgram: context => context.program,
            getExtendedOutput: context => context.output,
            getNextPosition: context => context.position,
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

    const operation = getOperationHandler(
        getOperationCode(program[position])
    );

    const context = {
        input,
        program,
        position,
        output
    };

    if (operation.name === 'halt') {

        return {
            program: operation.getModifiedProgram(context),
            output: operation.getExtendedOutput(context),
        };
    }

    return compute(
        input,
        operation.getModifiedProgram(context),
        operation.getNextPosition(context),
        operation.getExtendedOutput(context)
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
