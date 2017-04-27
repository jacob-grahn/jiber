import * as WebSocket from 'ws'
import onNewConnection from './web-socket-server/on-new-connection'
import { Reducer } from '../core'

const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', onNewConnection)
