/**
 * @module Game
 */

/**
 * @typedef {[number, number, number]} Tuple
 */

/**
 * @typedef {Object} Drawn
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */

/**
 * Parses the data from the given games data and extracts the unique games only.
 *
 * @function
 * @param {string} data - The games data.
 * @returns {Object.<number, Drawn[]>} A map of each game identifier to all drawings of it.
 */
const parseData = data => {
  const games = data.split('\n');
  const regex = /Game (\d+): (.*)/;
  const colorsRegex = /(\d+) (red|green|blue),?/g;

  return games.reduce((acc, gameData) => {
    const [, gameIdentifier, drawingsData] = gameData.match(regex);
    const drawings = drawingsData.split('; ').map((drawingData) => {
      let match;
      const drawing = { red: 0, green: 0, blue: 0 };

      while ((match = colorsRegex.exec(drawingData)) !== null) {
        const [, number, color] = match;
        drawing[color] = Number(number);
      }

      return drawing;
    });

    return { ...acc, [gameIdentifier]: drawings };
  }, {});
}

/**
 * Determines if a specific game is playable, given the number of cubes for each color.
 *
 * @function
 * @param {Drawn[]} gameDrawings - All drawings in the game.
 * @param {Tuple} availableCubes - The number of each cube in the bag.
 * @returns {boolean} True if the game can be played, False otherwise.
 */
const isGamePlayable = (gameDrawings, availableCubes) => {
  const [red, green, blue] = availableCubes;
  const areColorsEnoughForDrawing = ({ red: r, green: g, blue: b }) => r <= red && g <= green && b <= blue;

  return gameDrawings.every(areColorsEnoughForDrawing);
}

/**
 * Gets the sum of all game identifiers of playable games given the number of cubes for each color.
 *
 * @function
 * @param {Object.<number, Drawn[]>} games - All played games.
 * @param {Tuple} availableCubes - The number of each cube in the bag.
 * @returns {number} The sum of the game identifiers.
 */
const getSumOfIdentifiers = (games, availableCubes) => {
  const gameIds = Object.keys(games).map(Number);
  const playableGames = gameIds.filter(gameId => isGamePlayable(games[gameId], availableCubes));

  return playableGames.reduce((acc, gameId) => acc + gameId, 0);
}

/**
 * @function
 * @default
 * @param {string} data - Games data in format "Game (identifier): (number) (color), " or "; ".
 * @returns {number} The sum of all unique game identifiers, which can be played with available cubes.
 */
const main = (data) => {
  const games = parseData(data);
  const availableCubes = [12, 13, 14];

  return getSumOfIdentifiers(games, availableCubes);
}

export default main;
