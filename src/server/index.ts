import * as WebSocket from 'ws'
import onNewConnection from './web-socket-server/on-new-connection'

const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', onNewConnection)
