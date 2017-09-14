import { createWebSocket } from './create-web-socket'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
/* class MockWebSocket {
  url: string
  credential: string
  constructor (url: any, credential: any) {
    this.url = url
    this.credential = credential
  }
  get () {
    return {url: this.url, credential: this.credential}
  }
} */

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('it should throw an error, because WebSocket is undefined in node', () => {
  const url = 'some url'
  const credential = '123'
  expect(() => {
    createWebSocket(url, credential)
  }).toThrowError()
})

/* test('if WebSocket exists, create it', () => {
  const g = global as any
  g.WebSocket = MockWebSocket
  const url = 'some url'
  const credential = undefined
  const ws: any = createWebSocket(url, credential)
  expect(ws.get()).toEqual({url, credential})
  g.WebSocket = undefined
}) */
