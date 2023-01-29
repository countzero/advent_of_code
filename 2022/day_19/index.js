'use strict';

// Solutions for https://adventofcode.com/2022/day/19

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<Object>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split(/\r?\n/)
        .slice(0, -1)

        // We are transforming the custom blueprint notation into a plain object.
        .map(line => {

            const values = line
                .match(/\d+/g)
                .map(value => parseInt(value, 10));

            const blueprint = {
                id: values[0],
                costs: {
                    oreRobot: [values[1], 0, 0],
                    clayRobot: [values[2], 0, 0],
                    obsidianRobot: [values[3], values[4], 0],
                    geodeRobot: [values[5], 0, values[6]],
                },

                // We are calculating the maximum required robots
                // based on the required materials to reduce the
                // total number of execution paths.
                limits: {
                    oreRobot: Math.max(values[1], values[2], values[3], values[5]),
                    clayRobot: values[4],
                    obsidianRobot: values[6],
                    geodeRobot: Infinity,
                },
            };

            return blueprint;
        })
};

const calculateQualityLevels = (blueprints, durationInMinutes) => {

    return blueprints.map(
        blueprint => {

            const inventories = [
                {
                    oreRobot: 1,
                    clayRobot: 0,
                    obsidianRobot: 0,
                    geodeRobot: 0,
                    ore: 0,
                    clay: 0,
                    obsidian: 0,
                    geode: 0,
                }
            ];

            traverseDecisionTree(blueprint, durationInMinutes, inventories);

            const highestGeodeCount = inventories.reduce(
                (maxGeodes, inventory) => (inventory.geode > maxGeodes) ? inventory.geode : maxGeodes,
                0
            );

            return highestGeodeCount * blueprint.id;
        }
    );
};

const canProduce = (type, blueprint, inventory) => Boolean(
    inventory.ore >= blueprint.costs[type][0] &&
    inventory.clay >= blueprint.costs[type][1] &&
    inventory.obsidian >= blueprint.costs[type][2]
);

const shouldProduce = (type, blueprint, inventory, minutesLeft) => {

     const minutesLeftLimit = {
        oreRobot: 16,
        clayRobot: 6,
        obsidianRobot: 3,
        geodeRobot: 2,
    };

    if (minutesLeft < minutesLeftLimit[type]) {
        return false;
    };

    // We are limiting the number of a specific robot type
    // based on the required resources to build other robots.
    if (inventory[type] === blueprint.limits[type]) {
        return false;
    };

    // We are not building a "higher" robot before at least one
    // "lower" robot has been produced.
    if (type === 'obsidianRobot' && inventory['clayRobot'] === 0) {
        return false;
    }

     if (type === 'geodeRobot' && inventory['obsidianRobot'] === 0) {
        return false;
    }

    return true;
};

const evaluateNextBuildOptions = (blueprint, inventory, minutesLeft) => {

    // To _not_ build a new robot is always a valid option.
    const robotTypes = [
        null,
    ];

    [
        'oreRobot',
        'clayRobot',
        'obsidianRobot',
        'geodeRobot',

    ].forEach(type => {

        if (!canProduce(type, blueprint, inventory)) {
            return false;
        }

        if (!shouldProduce(type, blueprint, inventory, minutesLeft)) {
            return false;
        }

        robotTypes.push(type);
    });

    return robotTypes;
};

const mine = inventory => {

    inventory.ore += inventory.oreRobot;
    inventory.clay += inventory.clayRobot;
    inventory.obsidian += inventory.obsidianRobot;
    inventory.geode += inventory.geodeRobot;
};

const maybeBuild = (inventory, blueprint, robotType) => {

    if (robotType === null) {
        return;
    }

    inventory.ore -= blueprint.costs[robotType][0];
    inventory.clay -= blueprint.costs[robotType][1];
    inventory.obsidian -= blueprint.costs[robotType][2];

    inventory[robotType] += 1;
}

const traverseDecisionTree = (blueprint, minutesLeft, inventories, pathId = 0, robotType = null) => {

    mine(inventories[pathId]);

    maybeBuild(inventories[pathId], blueprint, robotType);

    minutesLeft -= 1;

    if (minutesLeft === 0) {
        return inventories;
    }

    evaluateNextBuildOptions(blueprint, inventories[pathId], minutesLeft)
        .forEach(robotType => {

            inventories.push(
                {
                    ...inventories[pathId]
                }
            );

            traverseDecisionTree(blueprint, minutesLeft, inventories, inventories.length - 1, robotType);
        });
}

console.log(
    'Solution for part one:',
    calculateQualityLevels(
        readInput(),
        24
    ).reduce(
        (sum, qualityLevel) => sum + qualityLevel,
        0
    )
);

console.log(
    'Solution for part two:'
);
