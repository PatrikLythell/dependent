#! /usr/bin/env node

fs = require 'fs'
colors = require 'colors'

console.log process.env.PWD

home = process.env.PWD+'/node_modules/'

#get user key input
userArgs = process.argv.slice(2)
userInput = userArgs[0]

console.log 'help' if userInput is 'help'
console.log userInput unless !userInput

nodeModules = []

isDirectory = (item, callback)->
  fs.stat home+item, (err, stats) ->
    throw err if err
    nodeModules.push(home+item) if stats.isDirectory()
    callback()

dependencies = {}

readPackage = (item, callback) ->
  data = require item+'/package.json'
  name = data.name
  version = data.version
  dependencies[name] = version
  callback()

writeDependencies = (object) ->
  fs.writeFile process.env.PWD+'/dependencies.json', JSON.stringify(object, null, 2)+',', 'utf-8', (err, data) ->
    throw err if err
    console.log "written file"

getNameAndVersion = (modules) ->
  counter = 0
  modules.forEach (module) ->
    readPackage module, ->
      counter++
      writeDependencies(dependencies) if counter is modules.length

fs.readdir home, (err, data) ->
  throw err if err
  counter = 0
  data.forEach (folder) ->
    isDirectory folder, ->
      counter++
      getNameAndVersion(nodeModules) if counter is data.length



