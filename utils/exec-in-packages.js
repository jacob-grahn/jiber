const execa = require('execa')
const fs = require('fs')

const packages = fs.readdirSync('packages')
const args = process.argv.splice(2)
const strArgs = args.join(' ')

packages.reduce((promise, pkg) => {
  return promise
    .then(() => console.log(`executing '${args.join(' ')}' in ${pkg}...`))
    .then(() => execa.shell(`cd packages/${pkg} && ${strArgs}`))
    .then(() => console.log('success!'))
}, Promise.resolve())
.catch(e => {
  console.log(e)
})
