#! /usr/bin/env node

//Dependencies
var fs = require('fs');

init = function() {

  //terminal output colours!
  //via http://roguejs.com/2011-11-30/console-colors-in-node-js/
  var red, blue, reset;
  red   = '\u001b[31m';
  blue  = '\u001b[34m';
  reset = '\u001b[0m';

  var home = process.env.PWD + '/node_modules/';
  var dependencies = {};
  var installedDeps = [];

  //init reading dirs in node_modules
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

  //Function to see if this is a dir
  isDirectory = function(item, callback) {
    fs.stat(home + item, function(err, stats) {
      if (err) {
        throw err;
      }
      //Fix for ignoring dirs such as ./bin
      dotCheck = item.slice(0,1)
      if (stats.isDirectory() && dotCheck !== '.') {
        installedDeps.push(home + item);
      }
      return callback();
    });
  };

  //parent function for reading package.json 
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

  //function for reading package.json from modules
  readPackage = function(item, callback) {
    var data, name, version;
    data = require(item + '/package.json');
    name = data.name;
    version = data.version;
    dependencies[name] = version;
    return callback();
  };

  //Writing depencies.json to PWD
  writeDependencies = function(object) {
    fs.writeFile(process.env.PWD + '/dependencies.json', JSON.stringify(object, null, 2) + ',', 'utf-8', function(err, data) {
      if (err) {
        console.log(red + "Something went wrong!" + reset);
      }
      return console.log(blue + "Created dependencies.json " + reset + "in " + blue + process.env.PWD + reset);
    });
  };

}

//If user has put in a value after 'dependent' show help or version, otherwise initiate dependent 
var userArgs = process.argv.slice(2);
var userInput = userArgs[0];
if (userInput) {
  var input = userInput.toLowerCase();
  if ( input === '-v' || input === '--version' ) {
    console.log('v0.0.1');
  } else {
    console.log("-> " + red + "Dependent " + reset + "-" + red + " v0.0.1" + reset);
    console.log("-> To upgrade to latest version: npm update dependent -g");
    console.log("");
    console.log("-> USAGE: 'dependent'");
    console.log("");
    console.log("-> BASIC USAGE");
    console.log("---> Run dependent in your working directory and a dependencies.json will be");
    console.log("---> created of all your node_modules.");
    console.log("");
    console.log("-> any feedback, help or issues, please report them on");
    console.log("Github: https://github.com/patriklythell/dependent/");
    console.log("");
    process.exit(1);
  } 
} else {
  init();
}