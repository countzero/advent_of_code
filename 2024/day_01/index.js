import assert from 'node:assert/strict';
import fs from 'fs';
import solvePartOne from './part_one.js';
import solvePartTwo from './part_two.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const example = `3   4
4   3
2   5
1   3
3   9
3   3`;

assert.deepStrictEqual(await solvePartOne(example), 11);
assert.deepStrictEqual(await solvePartTwo(example), 31);

const input = await fs.promises.readFile(`${__dirname}/input.txt`, 'utf-8');

console.log(`Solution for part one: ${await solvePartOne(input)}`);
console.log(`Solution for part two: ${await solvePartTwo(input)}`);
