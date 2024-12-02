/**
 * Calculate the similarity score as described in the task.
 * @param {string} input - The UTF-8 encoded string containing numbers from two lists.
 * @returns {number} - The calculated similarity score.
 */
export default function main(input) {
    const lines = input.trim().split('\n');
    const leftNumbers = [];
    const rightFrequency = new Map();

    lines.forEach(line => {
        const [left, right] = line.trim().split(/\s+/).map(Number);
        leftNumbers.push(left);
        rightFrequency.set(right, (rightFrequency.get(right) || 0) + 1);
    });

    return leftNumbers.reduce((sum, number) => {
        return sum + number * (rightFrequency.get(number) || 0);
    }, 0);
}