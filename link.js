const execa = require('execa')

Promise.resolve()
  .then(() => console.log(`creating jiber-core link...`))
  .then(() => execa.shell(`cd packages/jiber-core && npm link`))
  .then(() => execa.shell('node run npm link jiber-core'))
  .then(() => console.log('success!'))
  .catch(e => console.log(e))
