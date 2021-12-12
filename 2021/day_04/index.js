'use strict';

// Solutions for https://adventofcode.com/2021/day/4

const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<string>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/);
};


const getNumbers = input => input[0].split(',').map(number => parseInt(number, 10))

class BingoBoard {

    constructor(rows) {

        this.rows = rows;
        this.columns = this.getColumns(rows);
        this.markedNumbers = [];
        this.hasWon = false;
    }

    mark(number) {

        this.markedNumbers.push(number);
        this.setHasWon();
    }

    getColumns(rows) {

        let columns = [[],[],[],[],[],];

        columns = columns.map(
            (column, index) => [
                rows[0][index],
                rows[1][index],
                rows[2][index],
                rows[3][index],
                rows[4][index],
            ]
        );

        return columns;
    }

    setHasWon() {

        const fullRow = this.rows.some(
            row => row.every(
                number => this.markedNumbers.includes(number)
            )
        );

        const fullColumn = this.columns.some(
            column => column.every(
                number => this.markedNumbers.includes(number)
            )
        );

        this.hasWon = fullRow || fullColumn;
    }

    getScore() {

        const numbers = this.rows.flat();
        const lastCalledNumber = this.markedNumbers.at(-1);
        const unmarkedNumbers = numbers.filter(number => !this.markedNumbers.includes(number));

        return unmarkedNumbers.reduce((a, b) => a + b) * lastCalledNumber;
    }
}

const getBoards = input => {

    const boardRowCharacterLength = 14;
    const boardRowMaximum = 5;

    let boards = [];
    let rows = [];

    input.forEach(line => {

        if (line.length === boardRowCharacterLength) {

            rows.push(
                line.match(/\S+/g).map(number => parseInt(number, 10))
            );
        }

        if (rows.length === boardRowMaximum) {

            boards.push(
                new BingoBoard(rows)
            );

            rows = [];
        }
    });

    return boards;
};

const findFirstWinningBingoBoard = (numbers, bingoBoards) => {

    let winnerBingoBoard;

    for (let index = 0; index < numbers.length; index++) {

        winnerBingoBoard = bingoBoards.find(bingoBoard => {

            bingoBoard.mark(numbers[index]);

            return bingoBoard.hasWon;
        })

        if (winnerBingoBoard !== undefined) {
            break;
        }
    }

    return winnerBingoBoard;
};

console.log(
    'Solution for part one:',
    findFirstWinningBingoBoard(
        getNumbers(readInput()),
        getBoards(readInput())
    ).getScore()
);
