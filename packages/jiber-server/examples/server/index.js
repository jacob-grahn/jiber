const { JiberServer } = require('jiber-server')

// Start listening for incomming connections
const server = new JiberServer({
  actionTtl: 1000 * 60, // one minute
  port: 8080
})

console.log('Jiber Server is running!')

module.exports = server
