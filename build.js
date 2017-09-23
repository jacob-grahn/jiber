const execa = require('execa')
const fs = require('fs')
const _ = require('lodash')

const packages = fs.readdirSync('packages')

// make sure jiber-core is built first
const orderedPackages = _.uniq(['jiber-core', ...packages])

orderedPackages.reduce((promise, pkg) => {
  return promise
    .then(() => console.log(`building ${pkg}...`))
    .then(() => execa.shell(`cd packages/${pkg} && npm run build`))
    .then(() => console.log('success!'))
}, Promise.resolve())
.catch(e => {
  console.log(e)
})
