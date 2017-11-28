const https = require('https')
const fs = require('fs')
const jiber = require('../../packages/jiber-server')

const server = https.createServer({
  cert: fs.readFileSync('./certificate.pem'),
  key: fs.readFileSync('./key.pem')
})

const store = jiber.createStore({server})

store.start()

console.log('SSL Server is listening!')
