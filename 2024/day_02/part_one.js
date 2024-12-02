/**
 * Determines the number of safe reports based on the given rules.
 * @param {string} input - A string containing multiple reports, each report on a new line.
 * @returns {number} The number of safe reports.
 */
export default async function main(input) {
    const reports = input.trim().split('\n').map(report => report.split(' ').map(Number));
    let safeCount = 0;

    for (const report of reports) {
        let increasing = true;
        let decreasing = true;

        for (let i = 0; i < report.length - 1; i++) {
            const diff = Math.abs(report[i] - report[i + 1]);
            if (diff < 1 || diff > 3) {
                increasing = false;
                decreasing = false;
                break;
            }
            if (report[i] < report[i + 1]) {
                decreasing = false;
            } else if (report[i] > report[i + 1]) {
                increasing = false;
            }
        }

        if (increasing || decreasing) {
            safeCount++;
        }
    }

    return safeCount;
}