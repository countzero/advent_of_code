'use strict';

// Solutions for https://adventofcode.com/2019/day/7

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
 * @param {array<Number>} inputValues The program input values.
 * @param {array} program An intcode program.
 * @param {number} position The program pointer position.
 * @param {number} inputPosition The program input pointer position.
 * @param {array} output The program output log.
 * @returns {object} The compute result.
 */
const compute = (inputValues, program, signalsCallback, position = 0, inputPosition = 0, output = []) => {

    const operation = getOperationHandler(
        getOperationCode(program[position])
    );

    const context = {
        input: inputValues[inputPosition],
        program,
        position,
        output
    };

    if (operation.name === 'output') {

        // If there is a signal handler pause the computation
        // at every output instruction and delegate the further
        // processing by passing the current program state.
        if (signalsCallback) {

            const currentState = {
                inputValues,
                program: operation.getModifiedProgram(context),
                position: operation.getNextPosition(context),
                inputPosition,
                output: operation.getExtendedOutput(context),
            };

            signalsCallback('pause', currentState);

            return;
        }
    }

    if (operation.name === 'input') {

        inputPosition++;
    }

    if (operation.name === 'halt') {

        // If there is a signal handler inform it, that the
        // computer has reached the end of its program.
        if (signalsCallback) {
            signalsCallback(operation.name);
        }

        return {
            program: operation.getModifiedProgram(context),
            output: operation.getExtendedOutput(context),
        };
    }

    return compute(
        inputValues,
        operation.getModifiedProgram(context),
        signalsCallback,
        operation.getNextPosition(context),
        inputPosition,
        operation.getExtendedOutput(context)
    )
}

/**
 * Finds all permutations of a given set of values.
 *
 * @param {array<number>} values The permutation values.
 * @returns {array<array<number>>} All permutations.
 */
const findAllPermutations = (values = [0, 1, 2]) => {

    let result = [];

    for (let valuesIndex = 0; valuesIndex < values.length; valuesIndex++) {

        let rest = findAllPermutations(

            values
                .slice(0, valuesIndex)
                .concat(values.slice(valuesIndex + 1))
        );

        if (!rest.length) {

            result.push([values[valuesIndex]]);

        } else {

            for (let restIndex = 0; restIndex < rest.length; restIndex++) {

                result.push([values[valuesIndex]].concat(rest[restIndex]))
            }
        }
    }

    return result;
};

/**
 * Finds the largest output signal of the amplifier
 * series for a given set of phase setting sequences.
 *
 * @param {array<array<number>>} phaseSettingSequences The phase setting sequence for the run.
 * @param {function} runAmplifierConfiguration The execution function of a specific amplifier configuration.
 * @returns {number} The largest output of the amplifier series.
 */
const findLargestOutputSignal = async (phaseSettingSequences, runAmplifierConfiguration) => {

    let largestOutputSignal = 0;

    for (const phaseSettingSequence of phaseSettingSequences) {

        const amplifierOutput = await runAmplifierConfiguration(phaseSettingSequence);

        if (amplifierOutput > largestOutputSignal) {

            largestOutputSignal = amplifierOutput;
        }
    };

    return largestOutputSignal;
};

/**
 * Runs all amplifiers in series with a given phase setting sequence.
 *
 * @param {array<number>} phaseSettingSequence The phase setting sequence for the run.
 * @returns {number} The last amplifiers output value.
 */
const runAmplifiersInSeries = phaseSettingSequence => {

    let amplifierOutput = 0;

    phaseSettingSequence.forEach(phaseSetting => {

        amplifierOutput = compute(
            [phaseSetting, amplifierOutput],
            readIntcodeProgram()
        ).output[0];
    });

    return amplifierOutput;
}

/**
 * A stateful computer.
 */
class Computer {

    constructor (name, inputValues, program) {

        this.name = name;

        this.state = {
            inputValues,
            program,
            position: 0,
            inputPosition: 0,
            output: [],
        };
    }

    get lastOutput () {

        return this.state.output.slice(-1)[0];
    }

    setState (state) {

        this.state = state;

        return this;
    }

    setHaltCallback (haltCallback) {

        this.haltCallback = haltCallback;

        return this;
    }

    setOutputSignalHandler (outputSignalHandler) {

        this.outputSignalHandler = outputSignalHandler;

        return this;
    }

    addInputSignal (input) {

        this.state.inputValues.push(input);

        this.start();
    }

    handleSignals (signal, state) {

        if (signal === 'pause') {

            this.setState(state);

            this.outputSignalHandler.addInputSignal(this.lastOutput);
        }

        if (signal === 'halt') {

            if (this.haltCallback) {
                this.haltCallback(null, state);
            }
        }
    }

    start () {

        compute(
            this.state.inputValues,
            this.state.program,
            this.handleSignals.bind(this),
            this.state.position,
            this.state.inputPosition,
            this.state.output
        );
    }
}

/**
 * Runs all amplifiers in a feedback loop with a given phase setting sequence.
 *
 * @param {array<number>} phaseSettingSequence The phase setting sequence for the run.
 * @returns {Promise<number>} A promise on the last amplifiers output value.
 */
const runAmplifierFeedbackLoop = async phaseSettingSequence => {

    return new Promise((resolve, reject) => {

        const amplifierA = new Computer('Amplifier A', [phaseSettingSequence[0], 0], readIntcodeProgram());
        const amplifierB = new Computer('Amplifier B', [phaseSettingSequence[1]], readIntcodeProgram());
        const amplifierC = new Computer('Amplifier C', [phaseSettingSequence[2]], readIntcodeProgram());
        const amplifierD = new Computer('Amplifier D', [phaseSettingSequence[3]], readIntcodeProgram());
        const amplifierE = new Computer('Amplifier E', [phaseSettingSequence[4]], readIntcodeProgram());

        const getLastOutputOfAmplifierE = (error, result) => {

            if (error) {
                reject(error);
            }

            resolve(amplifierE.lastOutput);
        };

        amplifierA
            .setOutputSignalHandler(amplifierB)
            .setHaltCallback(getLastOutputOfAmplifierE);

        amplifierB
            .setOutputSignalHandler(amplifierC)
            .setHaltCallback(getLastOutputOfAmplifierE);

        amplifierC
            .setOutputSignalHandler(amplifierD)
            .setHaltCallback(getLastOutputOfAmplifierE);

        amplifierD
            .setOutputSignalHandler(amplifierE)
            .setHaltCallback(getLastOutputOfAmplifierE);

        amplifierE
            .setOutputSignalHandler(amplifierA)
            .setHaltCallback(getLastOutputOfAmplifierE);

        amplifierA.start();
    });
}

// Await only works in function scope.
(async () => {

    console.log(
        'Solution for part one:',
        await findLargestOutputSignal(
            findAllPermutations([0, 1, 2, 3, 4]),
            runAmplifiersInSeries
        )
    );

    console.log(
        'Solution for part two:',
        await findLargestOutputSignal(
            findAllPermutations([5, 6, 7, 8, 9]),
            runAmplifierFeedbackLoop
        )
    );

})();
