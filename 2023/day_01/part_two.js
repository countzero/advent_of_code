/**
 * Mapping from English words to numbers
 */
const numberTerms = {
    "zero": 0,
    "one" : 1,
    "two" : 2,
    "three" : 3,
    "four" : 4,
    "five" : 5,
    "six" : 6,
    "seven" : 7,
    "eight" : 8,
    "nine" : 9,
}

/**
 * Finds first and last numbers in a line, expressed as digits or spelled in English.
 * Builds a number from them (first * 10 + last) and returns it.
 *
 * @param {string} line - A line from the calibration document.
 *
 * @returns {number} - The calibration value of the line.
 */
const extractNumber = (line) => {
    const words = line.split(/(\D+)/);

    const firstNumber = words.find(word => word.match(/(\d+)|zero|one|two|three|four|five|six|seven|eight|nine/));
    const lastNumber = words.reverse().find(word => word.match(/(\d+)|zero|one|two|three|four|five|six|seven|eight|nine/));

    const firstDigit = isNaN(Number(firstNumber)) ? numberTerms[firstNumber] : Number(firstNumber);
    const lastDigit = isNaN(Number(lastNumber)) ? numberTerms[lastNumber] : Number(lastNumber);

    return firstDigit * 10 + lastDigit;
}

/**
 * Sums up all the calibration values in the document.
 *
 * @param {string} document - The calibration document.
 *
 * @returns {number} - Sum of all calibration values.
 */
const main = (document) => {

    const lines = document.split('\n');

    return lines.reduce((sum, line) => sum + extractNumber(line), 0);
}

export default main;
