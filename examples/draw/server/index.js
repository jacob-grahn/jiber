const jiber = require('jiber-server')
// const dbRedis = require('jiber-db-redis')

// const db = dbRedis.createDb({host: '127.0.0.1', port: 6379})
const store = jiber.createStore({})

store.start()
console.log('Draw with friends is running!')
