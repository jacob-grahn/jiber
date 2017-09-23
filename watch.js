const chokidar = require('chokidar')
const execa = require('execa')
const _ = require('lodash')
const fs = require('fs')

const packages = fs.readdirSync('packages')

packages.forEach(pkg => {
  const watcher = chokidar.watch(`packages/${pkg}/**/*.ts`, {
    ignored: /node_modules/
  })

  const handler = _.throttle(async () => {
    try {
      console.log(`\npackage ${pkg} changed`)
      await execa.shell(`cd packages/${pkg} && npm run build`)
      console.log(`done building ${pkg}`)
    } catch (e) {
      console.log(e)
    }
  }, 5000)

  setTimeout(() => {
    watcher.on('add', handler)
    watcher.on('change', handler)
    watcher.on('unlink', handler)
  }, 2000)
})

console.log('listening for changes!')
