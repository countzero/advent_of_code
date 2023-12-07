import assert from 'node:assert/strict';
import fs from 'fs';
import solvePartOne from './part_one.js';
import solvePartTwo from './part_two.js';

assert.deepEqual(
    await solvePartOne(
`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`
    ),
    142
);

assert.deepEqual(
    await solvePartTwo(
`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`
    ),
    281
)

const [
    solutionForPartOne,
    solutionForPartTwo
] = await Promise.all([
    solvePartOne(await fs.promises.readFile('./input.txt', 'utf-8')),
    solvePartTwo(await fs.promises.readFile('./input.txt', 'utf-8'))
]);

console.log(`Solution for part one: ${solutionForPartOne}`);
console.log(`Solution for part two: ${solutionForPartTwo}`);
