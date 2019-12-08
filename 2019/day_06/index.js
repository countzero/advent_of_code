'use strict';

// Solutions for https://adventofcode.com/2019/day/6

const fs = require('fs');
const path = require('path');

/**
 * Reads an universal orbit map into an array.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {array<array<string>>} The universal orbit map.
 */
const readUniversalOrbitMap = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs.readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
           .split(/\n/)
           .filter(relationship => relationship !== '')
           .map(relationship => relationship.split(/\)/));
};

/**
 * Recursively traces an orbit relationship back to the center of mass (COM) object.
 *
 * @param {array} relationship A orbit relationship.
 * @param {array<array<string>>} The universal orbit map.
 * @param {string} centerOfMass The object code for the center of mass.
 * @param {array} result All objects the initial object orbits around.
 * @returns {array} All objects the initial object orbits around.
 */
const recursivelyTracePathToCenterOfMass = (relationship, orbitRelationships, centerOfMass, result = []) => {

    const source = relationship[0];

    result.push(source);

    if (source === centerOfMass) {
        return result;
    }

    const nextOrbitRelationship = orbitRelationships.find(nextRelationship => nextRelationship[1] === source);

    return recursivelyTracePathToCenterOfMass(nextOrbitRelationship, orbitRelationships, centerOfMass, result);
}

/**
 * Counts all orbiting objects around the center of mass (COM) object.
 *
 * @param {array<array<string>>} The universal orbit map.
 * @param {string} centerOfMass The object code for the center of mass.
 * @returns {number} The total number of orbiting objects around the center of mass.
 */
const countAllOrbitingObjectsAroundCenterOfMass = (orbitRelationships, centerOfMass) => {

    let orbitCount = 0;

    orbitRelationships.forEach(relationship => {

        orbitCount += recursivelyTracePathToCenterOfMass(
            relationship,
            orbitRelationships,
            centerOfMass
        ).length;
    });

    return orbitCount;
}

// console.log(
//     'Solution for part one:',
//     countAllOrbitingObjectsAroundCenterOfMass(
//         readUniversalOrbitMap(),
//         'COM'
//     ),
// );

const getOrbitTraceFor = (objectCode, orbitRelationships, centerOfMass) => {

    return recursivelyTracePathToCenterOfMass(
        orbitRelationships.find(relationship => relationship[1] === objectCode),
        orbitRelationships,
        centerOfMass
    );
}


console.log(

    getOrbitTraceFor('YOU', orbitRelationships, 'COM'),
    getOrbitTraceFor('SAN', orbitRelationships, 'COM'),
);

console.log(
    'Solution for part two:',
    0,
);
