'use strict';

const chai = require('chai');
const expect = chai.expect;
const getGitIgnore = require('../src/get-gitignore');

// sample project contents fixtures
const npmContents = ['src/', 'node_modules/', 'package.json', '.env', '.npm'];
const pythonContents = ['src/', 'main.pyc', 'wheels/'];
const combinedContents = npmContents.concat(pythonContents);

describe('getGitIgnore', function() {
  it('gets the right .gitignore for a probable Node project', function() {
    expect(getGitIgnore(npmContents)).to.contain('Node.gitignore');
  });
  it('gets the right .gitignore for a probable Python project', function() {
    const contents = ['src/', 'main.pyc', 'wheels/'];
    expect(getGitIgnore(pythonContents)).to.contain('Python.gitignore');
  });
  it('gets a .gitignore for project with Node and Python', function() {
    expect(getGitIgnore(combinedContents, true)).to.eql(['Node.gitignore', 'Python.gitignore']);
  });
});
