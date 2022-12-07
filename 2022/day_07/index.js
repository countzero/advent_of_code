'use strict';

// Solutions for https://adventofcode.com/2022/day/7

const fs = require('fs');
const path = require('path');

/**
 * Reads the input items from a file.
 *
 * @param {string} relativeFilePath A file path relative to __dirname.
 * @param {string} encoding The input file encoding.
 * @returns {Array<String>} The input items.
 */
const readInput = (relativeFilePath = './input.txt', encoding = 'utf8') => {

    return fs
        .readFileSync(path.resolve(__dirname, relativeFilePath), encoding)
        .split('\n$ ')
        .map(items => items.split('\n'))
        .slice(1);
};

class Directory {

    files = [];
    children = [];

    constructor (name, parentDirectory = null) {
        this.name = name;
        this.parentDirectory = parentDirectory;
    }

    filesSize () {
        return this.files.reduce((result, file) => result += parseInt(file[0], 10), 0);
    }

    directoriesSize () {
        return this.children.reduce((result, child) => result += child.size(), 0);
    }

    size () {
        return this.filesSize() + this.directoriesSize();
    }

    parent () {
        return this.parentDirectory;
    }

    child (name) {
        return this.children.find(child => child.name === name);
    }

    parse (contents) {

        contents.forEach(content => {

            const item = content.split(' ');

            if (item[0] === 'dir') {

                this.children.push(
                    new Directory(item[1], this)
                );

                return;
            }

            this.files.push(item);
        });
    }
}

const findDirectoriesByMaximumSize = (directory, maximumSize, result = []) => {

    if (directory.size() <= maximumSize) {
        result.push(directory);
    }

    directory.children.forEach(child => {
        findDirectoriesByMaximumSize(child, maximumSize, result);
    });

    return result;
};

const createDirectoryTree = history => {

    const rootDirectory = new Directory('/');

    let workingDirectory = rootDirectory;

    history.forEach(commandHistory => {

        const command = commandHistory[0].substring(0, 2);
        const argument = commandHistory[0].substring(3);
        const result = commandHistory.slice(1);

        if (command === 'cd') {
            workingDirectory = argument === '..' ? workingDirectory.parent() : workingDirectory.child(argument);
        }

        if (command === 'ls') {
            workingDirectory.parse(result);
        }
    });

    return rootDirectory;
};

const calculateTotalSize = directories => directories.reduce((result, directory) => result += directory.size(), 0);

console.log(
    'Solution for part one:',
    calculateTotalSize(
        findDirectoriesByMaximumSize(
            createDirectoryTree(
                readInput()
            ),
            100000
        )
    ),
);

console.log(
    'Solution for part two:',
);
