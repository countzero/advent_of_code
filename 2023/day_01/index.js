import assert from 'node:assert/strict';
import fs from 'fs';
import solvePartOne from './part_one.js';
import solvePartTwo from './part_two.js';

let input;

input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

assert.deepEqual(
    await solvePartOne(input),
    142
);

input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

assert.deepEqual(
    await solvePartTwo(input),
    281
);

input = await fs.promises.readFile('./input.txt', 'utf-8');

console.log(`Solution for part one: ${await solvePartOne(input)}`);
console.log(`Solution for part two: ${await solvePartTwo(input)}`);
