const jiber = require('jiber-server')
const reducer = require('./reducer')

// Pass our custom app logic to jiber
const store = jiber.createStore({reducer})

// Start listening for incomming connections
store.start()
console.log('Jiber Server is running!')
