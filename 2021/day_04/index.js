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

class BingoBoard {

    constructor(rows) {
        this.rows = rows;
        this.columns = this.getColumns(rows);
        this.markedNumbers = [];
        this.hasWon = false;
        this.score = 0;
    }

    mark(number) {

        if (this.hasWon === true) {
            return;
        }

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

        this.setScore();
    }

    setScore() {

        const numbers = this.rows.flat();
        const unmarkedNumbers = numbers.filter(
            number => !this.markedNumbers.includes(number)
        );

        this.score = unmarkedNumbers.reduce((a, b) => a + b) * this.markedNumbers.at(-1);
    }
}

const getNumbers = input => input[0].split(',').map(number => parseInt(number, 10))

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

const findAllWinningBingoBoards = (numbers, bingoBoards) => {

    const winningBingoBoards = [];

    numbers.forEach(calledNumber => {

        bingoBoards.forEach(bingoBoard => {

            bingoBoard.mark(calledNumber);

            if (bingoBoard.hasWon && !winningBingoBoards.includes(bingoBoard)) {
                winningBingoBoards.push(bingoBoard);
            }
        })
    });

    return winningBingoBoards;
};

console.log(
    'Solution for part one:',
    findAllWinningBingoBoards(
        getNumbers(readInput()),
        getBoards(readInput())
    ).at(0).score
);

console.log(
    'Solution for part two:',
    findAllWinningBingoBoards(
        getNumbers(readInput()),
        getBoards(readInput())
    ).at(-1).score
);
