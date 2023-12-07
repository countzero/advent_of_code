/**
 * This function calculates the sum of calibration values from the given calibration document.
 *
 * @param {string} input - The calibration document.
 * @return {number} The sum of all calibration values.
 */
const calculateSumOfValues = (input) => {
  // Split the text into an array of separate lines.
  const lines = input.split('\n');

  // Use reduce to iterate over each line and calculate the total sum.
  const total = lines.reduce((sum, line) => {
    // The calibration value of a line is the first digit concatenated with the last digit.
    const firstDigit = line.match(/\d/)[0];   // The first digit in the line.
    const lastDigit = line.match(/\d/g).slice(-1)[0];   // The last digit in the line.
    const value = parseInt(firstDigit + lastDigit);

    // Add the value to the sum.
    return sum + value;
  }, 0);

  return total;
};

export default calculateSumOfValues;
