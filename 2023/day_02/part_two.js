/**
 * The cube counting function.
 * @param {string} s - The string to be parsed.
 * @return {number} - The sum of the power of the minimum set of cubes.
 */
function countCubes(s) {
    let totalPower = 0;
    const games = s.split('\n');

    for (let i = 0; i < games.length; i++) {
        let game = games[i].substring(games[i].indexOf(':') + 2).split('; ');
        let redCount = 0;
        let blueCount = 0;
        let greenCount = 0;

        for (let j = 0; j < game.length; j++) {
            let turns = game[j].split(', ');
            for (let k = 0; k < turns.length; k++) {
                let num = parseInt(turns[k]);
                if (turns[k].includes('red')) {
                    redCount = Math.max(redCount, num);
                } else if (turns[k].includes('blue')) {
                    blueCount = Math.max(blueCount, num);
                } else if (turns[k].includes('green')) {
                    greenCount = Math.max(greenCount, num);
                }
            }
        }

        totalPower += redCount * blueCount * greenCount;
    }

    return totalPower;
}

export default countCubes;