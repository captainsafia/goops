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

function getGitIgnore(contents, callback) {
  const ignored = {};
  gitignores.map(function(gitignore) {
    ignored[gitignore] = applies(gitignore, contents);
  });

  const sorted = Object.keys(ignored).sort(function(a, b) {
    return ignored[b] - ignored[a];
  });


  const counts = Object.values(ignored).reduce(function(count, value) {
    return count + (value === ignored[sorted[0]]);
  }, 0);

  if (counts > 1) {
    console.log('Multiple possible options found! Please select one from the list.');
    const filtered = Object.keys(pickBy(ignored, function(value, key) {
      return value === ignored[sorted[0]];
    }));

    filtered.forEach(function(element, index) {
      console.log((index + 1) + '. ' + element);
    });
    
    const choice = readline.question('Enter a number from the above: ');
    return filtered[choice - 1];  
  }

  return sorted[0];
}

module.exports = getGitIgnore;
