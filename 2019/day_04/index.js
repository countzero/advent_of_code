'use strict';

// Solutions for https://adventofcode.com/2019/day/4

const fs = require('fs');
const path = require('path');

let passwordRange;

/**
 * Reads the password range.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array} The password range.
 */
const readPasswordRange = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    if (passwordRange) {
        return passwordRange;
    }

    return passwordRange = fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
                          .split(/\n/)[0]
                          .split(/\-/);
};

/**
 * Filters validation checks by their ids.
 *
 * @param {Array} ids The ids of the requested validation checks.
 * @returns {Array<object>} The filtered validation checks.
 */
const filterValidationChecksByIds = (ids) => {

    return [

        {
            id: 1,
            description: 'The password must be within the given range.',
            check: password => {

                return (password >= readPasswordRange()[0] &&
                        password <= readPasswordRange()[1]);
            }
        },

        {
            id: 2,
            description: 'Two adjacent numbers must be the same.',
            check: password => {

                const passwordAsText = password.toString();

                let index = passwordAsText.length - 1;

                while (index--) {

                    if (passwordAsText.charAt(index) === passwordAsText.charAt(index + 1)) {
                        return true;
                    }
                }

                return false;
            }
        },

        {
            id: 3,
            description: 'Digits from left to right must not decrease.',
            check: password => {

                const passwordAsText = password.toString();

                let index = passwordAsText.length - 1;

                while (index--) {

                    if (passwordAsText.charAt(index) > passwordAsText.charAt(index + 1)) {
                        return false;
                    }
                }

                return true;
            }
        }

    ].filter(validationCheck => ids.includes(validationCheck.id));
}

/**
 * Validates a six digit password against a given set of validation checks.
 *
 * @param {integer} password A six digit password.
 * @param {Array<object>} validationChecks Validation checks.
 * @returns {Boolean} The result of the validation.
 */
const passwordIsValid = (password, validationChecks) => {

    return validationChecks.every(validationCheck => validationCheck.check(password));
}

/**
 * Finds valid six digit passwords by brute force.
 *
 * @param {Array} passwordRange The password range.
 * @param {Array<object>} validationChecks Validation checks.
 * @returns {Array} All valid six digit passwords.
 */
const findValidSixDigitPasswordsByBruteForce = (passwordRange, validationChecks) => {

    const validPasswords = [];

    let password = passwordRange[0];

    while (password < passwordRange[1]) {

        password++;

        if (passwordIsValid(password, validationChecks)) {
            validPasswords.push(password);
        }
    }

    return validPasswords;
}

console.log(
    'Solution for part one:',
    findValidSixDigitPasswordsByBruteForce(
        readPasswordRange(),
        filterValidationChecksByIds([1,2,3])
    ).length
);

console.log(
    'Solution for part two:',
    0
);
