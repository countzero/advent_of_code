import { promises as fs } from 'fs';

/**
 * Get the combined numerical value from a string
 *
 * @param {string} str - input string to extract numerical values
 * @return {number} a combined numerical value
 */
const getValue = str => {
    const numMapping = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };

    let firstNum = '', lastNum = '', found = false;

    // Iterate over the mapping and find numbers in the form of text
    for (const key in numMapping) {
        if (!str.includes(key)) continue;

        // Replace text numbers with actual numbers
        str = str.replace(new RegExp(key, 'g'), numMapping[key]);
    }

    // Find first and last digits
    for (let i = 0; i < str.length; i++) {
        if (!firstNum && /\d/.test(str[i])) {
            firstNum = str[i];
        }

        if (/\d/.test(str[i])) {
            lastNum = str[i];
            found = true;
        }
    }

    return found ? parseInt(firstNum + lastNum) : 0;
};

/**
 * Main function to solve the problem
 *
 * @return {Promise<number>} a promise that resolves with the sum of calibration values
 */
async function main() {
    const data = await fs.readFile('./input.txt', 'utf-8');
    const lines = data.split('\n');

    return lines.reduce((acc, line) => acc + getValue(line.trim()), 0);
}

export default main;
