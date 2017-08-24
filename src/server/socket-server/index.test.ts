import { createSocketServer } from './index'
import { defaultSettings } from '../default-settings'
import * as EventEmitter from 'events'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
const settings = {...defaultSettings}
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
