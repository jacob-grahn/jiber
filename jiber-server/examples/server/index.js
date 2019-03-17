const JiberServer = require('jiber-server')

// Start listening for incomming connections
const server = new JiberServer({ port: 8080 })

console.log('Jiber Server is running!')

module.exports = server
