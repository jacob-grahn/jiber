const jiber = require('jiber-server')
const dbRedis = require('jiber-db-redis')

console.log({dbRedis})
console.log(dbRedis.createDb)

const db = dbRedis.createDb({host: '127.0.0.1', port: 6379})
const store = jiber.createStore({db})

store.start()
console.log('Draw with friends is running!')
