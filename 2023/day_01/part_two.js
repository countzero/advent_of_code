/**
 * @param {string} input
 * @returns {number}
 */
const main = (input) => {
    const listNumbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
    const lines = input.split("\n");
    let sum = 0;

    for (const line of lines) {
      let first = null, last = null;
      for (let index = 0; index < line.length; index++) {
        const end_index = line.length - index - 1;
        if (first === null) {
          if (/\d/.test(line[index])) {
            first = +line[index];
          } else {
            for (let num = 1; num < listNumbers.length; num++) {
              if (line.startsWith(listNumbers[num], index)) {
                first = num;
                break;
              }
            }
          }
        }

        if (last === null) {
          if (/\d/.test(line[end_index])) {
            last = +line[end_index];
          } else {
            for (let num = 1; num < listNumbers.length; num++) {
              if (line.startsWith(listNumbers[num], end_index - listNumbers[num].length + 1)) {
                last = num;
                break;
              }
            }
          }
        }

        if (first !== null && last !== null) break;
      }

      sum += first * 10 + last;
    }

    return sum;
  };

export default main;
