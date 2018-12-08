const https = require('https')
const fs = require('fs')
const jiber = require('../../packages/jiber-server')

const server = https.createServer({
  cert: fs.readFileSync('./certificate.pem'),
  key: fs.readFileSync('./key.pem')
})

const store = jiber.createStore({server})
store.start()

server.listen(443, () => {
  console.log(`SSL Server is listening on port ${server.address().port}!`)
})
