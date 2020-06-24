const JiberServer = require('jiber-server')
const jiberRedis = require('jiber-redis')

// Start listening for incomming connections
const server = new JiberServer({
    port: 8080,
    middleware: [jiberRedis({host: 'redis'})]
})

console.log('Jiber Server is running!')

module.exports = server
