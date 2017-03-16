'use strict';

const chai = require('chai');
const expect = chai.expect;
const getGitIgnore = require('../src/get-gitignore');

describe('getGitIgnore', function() {
  it('gets the right .gitignore for a probable Node project', function() {
    const contents = ['src/', 'node_modules/', 'package.json', '.env', '.npm'];
    expect(getGitIgnore(contents)).to.contain('Node.gitignore');
  });
  it('gets the right .gitignore for a probable Python project', function() {
    const contents = ['src/', 'main.pyc', 'wheels/'];
    expect(getGitIgnore(contents)).to.contain('Python.gitignore');
  });
  it('gets a .gitignore for project with Node and Python', function() {
    const contents = ['src/', 'node_modules/', 'package.json', '.env', '.npm', 'src/', 'main.pyc', 'wheels/'];
    expect(getGitIgnore(contents, true)).to.eql(['Node.gitignore', 'Python.gitignore']);
  });
});
