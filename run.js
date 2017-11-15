const execa = require('execa')
const fs = require('fs')
const _ = require('lodash')

const packages = fs.readdirSync('packages')
const args = process.argv.splice(2)
const strArgs = args.join(' ')

// make sure jiber-core is built first
const orderedPackages = _.uniq(['jiber-core', ...packages])

orderedPackages.reduce((promise, pkg) => {
  return promise
    .then(() => console.log(`executing in ${pkg}...`))
    .then(() => execa.shell(`cd packages/${pkg} && ${strArgs}`))
    .then(() => console.log('success!'))
}, Promise.resolve())
.catch(e => {
  console.log(e)
})
