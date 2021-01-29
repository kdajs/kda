#!/usr/bin/env node

const { error } = require('./output')
const command = process.argv[2]

switch (command) {
  case 'pm2exec':
    require('./pm2exec')
    break
  default:
    error('command undefined')
}
