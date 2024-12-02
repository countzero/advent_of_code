import assert from 'node:assert/strict';
import fs from 'fs';
import solvePartOne from './part_one.js';
import solvePartTwo from './part_two.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const example = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const input = await fs.promises.readFile(`${__dirname}/input.txt`, 'utf-8');

assert.deepStrictEqual(await solvePartOne(example), 2);

console.log(`Solution for part one: ${await solvePartOne(input)}`);

assert.deepStrictEqual(await solvePartTwo(example), 4);

console.log(`Solution for part two: ${await solvePartTwo(input)}`);
