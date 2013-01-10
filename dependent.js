#! /usr/bin/env node

var fs = require('fs');
var colors = require('colors');

var home = process.env.PWD + '/node_modules/';

var installedDeps = [];

isDirectory = function(item, callback) {
  fs.stat(home + item, function(err, stats) {
    if (err) {
      throw err;
    }
    if (stats.isDirectory()) {
      installedDeps.push(home + item);
    }
    return callback();
  });
};

dependencies = {};

readPackage = function(item, callback) {
  var data, name, version;
  data = require(item + '/package.json');
  name = data.name;
  version = data.version;
  dependencies[name] = version;
  return callback();
};

writeDependencies = function(object) {
  fs.writeFile(process.env.PWD + '/dependencies.json', JSON.stringify(object, null, 2) + ',', 'utf-8', function(err, data) {
    if (err) {
      console.log("Something went wrong!".red);
    }
    return console.log("Written dependencies.json to ".cyan + process.env.PWD.green);
  });
};

getNameAndVersion = function(modules) {
  var counter = 0;
  modules.forEach(function(module){
    readPackage(module, function(){
      counter++;
      if (counter === modules.length) {
        writeDependencies(dependencies);
      }
    });
  });
};

init = function() {
  fs.readdir(home, function(err, data) {
    var counter = 0;
    if (err) {
      throw err;
    }
    data.forEach(function(folder){
      isDirectory(folder, function(){
        counter++;
        if (counter === data.length) {
          getNameAndVersion(installedDeps);
        }
      });
    });
  });
};

var userArgs = process.argv.slice(2);
var userInput = userArgs[0];
if (userInput) {
  console.log(userInput);
  var input = userInput.toLowerCase();
  if ( input === '-v' || input === '--version' ) {
    console.log('v0.1.0');
  } else {
    console.log('help');
  } 
} else {
  init();
}