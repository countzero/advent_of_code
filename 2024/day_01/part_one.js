/**
 * Calculates the total distance between two lists of numbers.
 * The numbers are paired from smallest to smallest, and the distance
 * is the absolute difference between the numbers in each pair.
 *
 * @param {string} input - UTF-8 encoded string containing two columns of numbers.
 * @returns {number} The total distance between the given lists.
 */
export default function main(input) {
    // Split the input into lines and then split each line into two numbers
    const lines = input.trim().split('\n');
    const leftList = [];
    const rightList = [];

    lines.forEach(line => {
        const [left, right] = line.trim().split(/\s+/).map(Number);
        leftList.push(left);
        rightList.push(right);
    });

    // Sort both lists
    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);

    // Calculate the total distance
    let totalDistance = 0;
    for (let i = 0; i < leftList.length; i++) {
        totalDistance += Math.abs(leftList[i] - rightList[i]);
    }

    return totalDistance;
}