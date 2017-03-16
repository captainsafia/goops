#! /usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const getGitIgnore = require('./get-gitignore');

const cwd = process.cwd();

const contents = fs.readdirSync(cwd).map(function(element) {
  if (fs.statSync(path.join(cwd, element)).isDirectory()) {
    return element + "/";
  } else {
    return element;
  }
});

const gitignoresArray = getGitIgnore(contents);
const filePath = path.join(cwd, '/.gitignore');

gitignoresArray.forEach((element, index) => {
  const gitignore = path.join(__dirname, '/../gitignores', element);
  fs.createReadStream(gitignore).pipe(fs.createWriteStream(filePath, { flags: 'a' }));
})
