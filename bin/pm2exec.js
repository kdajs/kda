const { error } = require('./output')
const env = process.argv[3]

!env && error('env undefined')

const fs = require('fs')
const path = require('path')
const root = process.cwd()
const execa = require('execa')
const packageJsonPath = path.resolve(root, 'package.json')

!fs.existsSync(packageJsonPath) && error('package.json undefined')

const packageJson = require(packageJsonPath)
const { name, main } = packageJson

!name && error('package.json name undefined')

const command = `cross-env NODE_ENV="${env}" pm2 start ${main} --name ${name}/${env}`

console.log('>', command)

execa.command(command, { stdio: 'inherit' })
