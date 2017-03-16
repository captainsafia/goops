'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

const minimatch = require('minimatch');
const pickBy = require('lodash.pickby');

const ignores = path.join(__dirname, '/../gitignores/');
const gitignores = fs.readdirSync(ignores);

function applies(gitignore, contents) {
  const data = fs.readFileSync(path.join(ignores, gitignore));
  const ignored = data.toString().split("\n").filter(function(ignored) {
    return !ignored.startsWith('#') && !ignored.startsWith('!');
  });

  let count = 0;
  const ignoredGlobs = ignored.map(function(line) {
    return contents.map(function(element) {
      if (minimatch(element, line)) count++;
    });
  });
  
  return count; 
}

function getGitIgnore(contents, selectAll = false) {
  const ignored = {};
  const relevantGitignores = []; // used to return an array of gitignores push into the local .gitignore

  gitignores.map(function(gitignore) {
    ignored[gitignore] = applies(gitignore, contents);
  });

  const sorted = Object.keys(ignored).sort(function(a, b) {
    return ignored[b] - ignored[a];
  });


  const counts = Object.keys(ignored).reduce(function(count, value) {
    return count + (ignored[value] === ignored[sorted[0]]);
  }, 0);

  if (counts > 1) {
    const filtered = Object.keys(pickBy(ignored, function(value, key) {
      return value === ignored[sorted[0]];
    }));

    // if selectAll is true we'll skip the option display and just return all the options
    if (selectAll) {
      return filtered;
    }

    console.log('Multiple possible options found! Please select one from the list.');

    filtered.forEach(function(element, index) {
      console.log((index + 1) + '. ' + element);
    });

    const selectAllNumber = filtered.length + 1;
    console.log(`${selectAllNumber}. Select All`);

    const choice = readline.question('Enter a number from the above: ');

    if (choice == selectAllNumber) {
      return filtered; // returns an array of all the options
    };

    relevantGitignores.push(filtered[choice - 1]);
    return relevantGitignores;
  }

  relevantGitignores.push(sorted[0]);
  return relevantGitignores;
}

module.exports = getGitIgnore;
