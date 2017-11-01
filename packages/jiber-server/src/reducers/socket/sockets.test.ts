import { INIT_SOCKET } from 'jiber-core'
import { sockets } from './sockets'

test('create a socket dictionary', () => {
  expect(sockets(undefined, { type: INIT_SOCKET, socketId: '444', ws: 'beep' }))
    .toEqual({'444': {
      ws: 'beep'
    }})
})

test('ignore unrelated actions', () => {
  expect(sockets(undefined, { type: 'la', socketId: '444' }))
    .toEqual({})
})
