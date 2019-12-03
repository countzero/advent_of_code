'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Reads the wire directions into an two dimensional array.
 *
 * @see https://adventofcode.com/2019/day/3
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<Array<string>>} The wire directions.
 */
const readWireDirections = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
           .split(/\r?\n/)
           .map(wireDirections => wireDirections.split(/,/));
};

/**
 * Traces the wire directions in relation to the origin.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @returns {Array<Array<number>>} The wire x and y coordinates in relation to the origin.
 */
const traceFromOrigin = wireDirections => {

    const positionsRelativeToOrigin = [];

    let x = 0;
    let y = 0;

    wireDirections.forEach(wireDirection => {

        const direction = wireDirection.substr(0,1);
        let steps = parseInt(wireDirection.substr(1), 10);

        switch (direction) {

            case 'U':

                while (steps--) {
                    positionsRelativeToOrigin.push([x, y]);
                    y += 1;
                }
                break;

            case 'R':

                while (steps--) {
                    positionsRelativeToOrigin.push([x, y]);
                    x += 1;
                }
                break;

            case 'D':

                while (steps--) {
                    positionsRelativeToOrigin.push([x, y]);
                    y -= 1;
                }
                break;

            case 'L':

                while (steps--) {
                    positionsRelativeToOrigin.push([x, y]);
                    x -= 1;
                }
                break;
        }

    });

    return positionsRelativeToOrigin;
}

/**
 * Finds all intersections of two wire traces.
 *
 * @param {Array<Array<number>>} positionsA The first wire positions.
 * @param {Array<Array<number>>} positionsB The second wire positions.
 * @returns {Array<Array<number>>} The intersection coordinates.
 */
const findIntersections = (positionsA, positionsB) => {

    return positionsA.filter(positionA => {

        return positionsB.some(positionB => {

            return positionA[0] === positionB[0] &&
                   positionA[1] === positionB[1];
        });
    });
};

/**
 * Calculates the Manhatten distance from the origin to the nearest intersection.
 *
 * @param {Array<Array<number>>} intersections The intersections between two wires
 * @returns {number} The Manhattan distance from the origin to the nearest intersection.
 */
const calculateDistanceToNearestIntersection = intersections => {

    let distance = Number.MAX_VALUE;

    intersections.forEach(intersection => {

        const intersectionDistanceToOrigin = Math.abs(intersection[0]) + Math.abs(intersection[1]);

        if (intersectionDistanceToOrigin > 0 &&
            intersectionDistanceToOrigin < distance) {

            distance = intersectionDistanceToOrigin;
        }
    });

    return distance;
}

console.log(
    'Solution for part one:',
    calculateDistanceToNearestIntersection(
        findIntersections(
            traceFromOrigin(readWireDirections()[0]),
            traceFromOrigin(readWireDirections()[1])
        )
    )
);
