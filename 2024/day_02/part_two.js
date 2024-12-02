// @ts-check

/**
 * Checks if a report is safe.
 * @param {number[]} levels - The levels to check.
 * @returns {boolean} - True if the report is safe, false otherwise.
 */
function isSafe(levels) {
    const n = levels.length;
    let isIncreasing = true, isDecreasing = true;

    for (let i = 1; i < n; i++) {
        const diff = levels[i] - levels[i - 1];
        if (diff < 1 || diff > 3) {
            isIncreasing = false;
        }
        if (-diff < 1 || -diff > 3) {
            isDecreasing = false;
        }
    }
    return isIncreasing || isDecreasing;
}

/**
 * Checks if a report can be made safe by removing one level.
 * @param {number[]} levels - The levels to check.
 * @returns {boolean} - True if the report can be made safe by removing one level, false otherwise.
 */
function canBeMadeSafe(levels) {
    const n = levels.length;
    for (let i = 0; i < n; i++) {
        const filteredLevels = levels.slice(0, i).concat(levels.slice(i + 1));
        if (isSafe(filteredLevels)) {
            return true;
        }
    }
    return false;
}

/**
 * Analyzes the unusual data and returns the number of safe reports.
 * @param {string} input - The input to analyze.
 * @returns {number} - The number of safe reports.
 */
export default function main(input) {
    const reports = input.trim().split('\n').map(line => line.split(' ').map(Number));
    let safeCount = 0;

    for (const report of reports) {
        if (isSafe(report) || canBeMadeSafe(report)) {
            safeCount++;
        }
    }

    return safeCount;
}