'use strict';

// Solutions for https://adventofcode.com/2019/day/4

const fs = require('fs');
const path = require('path');

/**
 * Reads the password range.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array} The password range.
 */
const readPasswordRange = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
           .split(/\n/)[0]
           .split(/\-/);
};

/**
 * Validates a six digit password against all validation rules.
 *
 * @param {integer} password A six digit password.
 * @param {Array} passwordRange The password range.
 * @returns {Boolean} The result of the validation.
 */
const passwordIsValid = (password, passwordRange) => {

    return [

        {
            description: 'The password must be within the given range.',
            check: password => {

                return (password >= passwordRange[0] &&
                        password <= passwordRange[1]);
            }
        },

        {
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
        },

    ].every(validationRule => validationRule.check(password));
};

/**
 * Finds valid six digit passwords by brute force.
 *
 * @param {Array} passwordRange The password range.
 * @returns {Array} All valid six digit passwords.
 */
const findValidSixDigitPasswordsByBruteForce = passwordRange => {

    const validPasswords = [];

    let password = passwordRange[0];

    while (password < passwordRange[1]) {

        password++;

        if (passwordIsValid(password, passwordRange)) {
            validPasswords.push(password);
        }
    }

    return validPasswords;
}

console.log(
    'Solution for part one:',
    findValidSixDigitPasswordsByBruteForce(readPasswordRange()).length
);
