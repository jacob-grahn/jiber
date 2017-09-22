const chokidar = require('chokidar')
const execa = require('execa')

const clientWatcher = chokidar.watch('packages/jiber-client')

clientWatcher.on('change', async (path, stats) => {
  await execa.shell('npm run build').stdout.pipe(process.stdout)
})
