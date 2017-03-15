'use strict';

const chai = require('chai');
const expect = chai.expect;
const getGitIgnore = require('../src/get-gitignore');

describe('getGitIgnore', function() {
  it('gets the right .gitignore for a probable Node project', function() {
    const contents = ['src/', 'node_modules/', 'package.json', '.env', '.npm'];
    expect(getGitIgnore(contents)).to.equal('Node.gitignore');
  });
  it('gets the right .gitignore for a probable Python project', function() {
    const contents = ['src/', 'main.pyc', 'wheels/'];
    expect(getGitIgnore(contents)).to.equal('Python.gitignore');
  });
});
