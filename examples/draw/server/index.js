const jiber = require('jiber-server')

const store = jiber.createStore({})

store.start()
console.log('Draw is running!')
