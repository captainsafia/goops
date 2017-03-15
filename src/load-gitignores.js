'use strict';

const fs = require('fs');
const gitignore = require('gitignore');
const path = require('path');

const ignores = path.join(__dirname, '/../gitignores');

gitignore.getTypes(function(error, types) {
  if (error) return console.log(error);

  types.map(function(type) {
    gitignore.writeFile({
      type: type,
      file: fs.createWriteStream(path.join(ignores, type + '.gitignore'))
    }, function(error) {
      if (error) return console.log(error);
    });  
  });
});
