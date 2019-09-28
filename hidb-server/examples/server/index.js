const HiDBServer = require('hidb-server')

// Start listening for incomming connections
const server = new HiDBServer({ port: 8080 })

console.log('HiDB Server is running!')

module.exports = server
