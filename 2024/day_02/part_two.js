/**
 * Checks if the array is non-increasing.
 * @param {number[]} levels - The array of levels.
 * @returns {boolean} True if the array is non-increasing, false otherwise.
 */
function isNonIncreasing(levels) {
    for (let i = 0; i < levels.length - 1; i++) {
        if (levels[i] < levels[i + 1]) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if the array can be made non-increasing by removing one element.
 * @param {number[]} levels - The array of levels.
 * @returns {boolean} True if the array can be made non-increasing by removing one element, false otherwise.
 */
function canBecomeNonIncreasingByRemovingOne(levels) {
    for (let i = 0; i < levels.length; i++) {
        const modified = levels.slice(0, i).concat(levels.slice(i + 1));
        if (isNonIncreasing(modified)) {
            return true;
        }
    }
    return false;
}

/**
 * Main function to count the number of safe reports.
 * @param {string} input - UTF-8 encoded string containing reports.
 * @returns {Promise<number>} The number of safe reports.
 */
export default async function main(input) {
    const reports = input.trim().split('\n');
    let count = 0;
    for (const report of reports) {
        const levels = report.split(' ').map(Number);
        if (isNonIncreasing(levels) || canBecomeNonIncreasingByRemovingOne(levels)) {
            count++;
        }
    }
    return count;
}
