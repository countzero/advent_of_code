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

                // We are limiting the needed robots by the
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

const composeInitialInventory = blueprintId => (
    {
        blueprintId,
        oreRobot: 1,
        clayRobot: 0,
        obsidianRobot: 0,
        geodeRobot: 0,
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
        ordered: {
            oreRobot: 0,
            clayRobot: 0,
            obsidianRobot: 0,
            geodeRobot: 0,
        }
    }
);

const mineResources = inventory => {
    inventory.ore += inventory.oreRobot;
    inventory.clay += inventory.clayRobot;
    inventory.obsidian += inventory.obsidianRobot;
    inventory.geode += inventory.geodeRobot;
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
        console.log(
            `[!] Should not produce ${type} with ${minutesLeft} minutes left.`,
        );
        return false;
    };

    if (inventory[type] === blueprint.limits[type]) {

        console.log(
            `[!] Should not produce ${type} when already ${blueprint.limits[type]} produced.`,
        );
        return false;
    };

    // // We do not want to build clay robots before enoz
    // if (type === 'clayRobot' && inventory['oreRobot'] < blueprint.limits['oreRobot']) {

    //     console.log(
    //         `[!] Should not produce clayRobot before oreRobot limit of ${blueprint.limits['oreRobot']} has reached.`,
    //     );
    //     return false;
    // }

    if (type === 'obsidianRobot' && inventory['clayRobot'] === 0) {
        console.log(
            '[!] Should not produce obsidianRobot before clayRobot has been built.',
        );
        return false;
    }

     if (type === 'geodeRobot' && inventory['obsidianRobot'] === 0) {
        console.log(
            '[!] Should not produce geodeRobot before obsidianRobot has been built.',
        );
        return false;
    }

    return true;
};

const maybeProduce = (type, blueprint, inventory, minutesLeft) => {

    if (!canProduce(type, blueprint, inventory)) {
        return false;
    }

    if (!shouldProduce(type, blueprint, inventory, minutesLeft)) {
        return false;
    }

    console.log('[+]', type);

    inventory.ore -= blueprint.costs[type][0];
    inventory.clay -= blueprint.costs[type][1];
    inventory.obsidian -= blueprint.costs[type][2];

    inventory.ordered[type] += 1;

    return true;
};

const orderProductionOfRobots = (blueprint, inventory, minutesLeft) => {

    console.log(
        'available resources',
        {
            ore: inventory.ore,
            clay: inventory.clay,
            obsidian: inventory.obsidian,
            geode: inventory.geode,
        }
    );

    maybeProduce('geodeRobot', blueprint, inventory, minutesLeft);
    maybeProduce('obsidianRobot', blueprint, inventory, minutesLeft);
    maybeProduce('clayRobot', blueprint, inventory, minutesLeft);
    maybeProduce('oreRobot', blueprint, inventory, minutesLeft);
};

const collectProducedRobots = inventory => {

    [
        'oreRobot',
        'clayRobot',
        'obsidianRobot',
        'geodeRobot',
    ].forEach(type => {
        inventory[type] += inventory.ordered[type];
        inventory.ordered[type] = 0;
    });

    console.log(
        'collectProducedRobots',
        {
            oreRobot: inventory.oreRobot,
            clayRobot: inventory.clayRobot,
            obsidianRobot: inventory.obsidianRobot,
            geodeRobot: inventory.geodeRobot,
        }
    );
};

const execute = (blueprint, inventory, minutesLeft) => {

    orderProductionOfRobots(blueprint, inventory, minutesLeft);

    mineResources(inventory);

    collectProducedRobots(inventory);

    return inventory;
};

const calculateQualityLevel = inventory => {
    inventory.qualityLevel = inventory.blueprintId * inventory.geode;
};

const dryRun = (blueprints, durationInMinutes) => {

    blueprints = [
        {
            id: 1,
            costs: {
                oreRobot: [4, 0, 0],
                clayRobot: [2, 0, 0],
                obsidianRobot: [3, 14, 0],
                geodeRobot: [2, 0, 7],
            },
            limits: {
                oreRobot: 4,
                clayRobot: 5,
                obsidianRobot: 7,
                geodeRobot: Infinity,
            },
        }
    ];

    return blueprints.map(
        blueprint => {

            let minutesLeft = durationInMinutes;
            let inventory = composeInitialInventory(blueprint.id);

            while (minutesLeft--) {

                console.log(`\n== Minute ${durationInMinutes - minutesLeft} ==`);

                inventory = execute(blueprint, inventory, minutesLeft);
            }

            calculateQualityLevel(inventory);

            return inventory;
        }
    );
};

// console.log(

//     readInput()
//         .map(blueprint => (
//             {
//                 id: blueprint.id,
//                 ...blueprint.costs,
//             }
//         )
//     )
// );

// console.log(

//     dryRun(
//         readInput(),
//         24
//     )
// );

console.log(
    'Solution for part one:',
    dryRun(
        readInput(),
        24
    ).reduce(
        (qualityLevelSum, inventory) => qualityLevelSum + inventory.qualityLevel,
        0
    )
);

console.log(
    'Solution for part two:'
);
