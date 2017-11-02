const jiber = require('jiber-server')

const store = jiber.createStore({})

store.socketServer.start()
console.log('Draw is running!')
