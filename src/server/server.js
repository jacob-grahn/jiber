import * as WebSocket from 'ws'
import processNewConnection from './sockets/process-new-connection'

const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', processNewConnection)
