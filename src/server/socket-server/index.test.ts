import { createSocketServer } from './index'
import { defaultServerSettings } from '../default-server-settings'
import * as EventEmitter from 'events'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
const settings = {...defaultServerSettings}
const store: any = {
  getState: () => { /* do nothing */ }
}
const emitter = new EventEmitter()

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('it should give us a nice public interface', () => {
  const socketServer = createSocketServer(store, settings, emitter)
  expect(socketServer.start).toBeTruthy()
  expect(socketServer.sendToUser).toBeTruthy()
  expect(socketServer.sendToRoom).toBeTruthy()
})
