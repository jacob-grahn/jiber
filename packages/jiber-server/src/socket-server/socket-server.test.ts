import * as WS from 'ws'
import { createServerStore } from '../server-store'
import { LOGIN_RESULT } from 'jiber-core'

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('listen on port', (done) => {
  const store = createServerStore({port: 1001})
  store.start()
  const ws = new WS('ws://127.0.0.1:1001')
  ws.on('open', () => {
    ws.close()
    store.stop()
    done()
  })
  ws.on('error', (e) => {
    ws.close()
    store.stop()
    done(e)
  })
})

test('actions should come back', (done) => {
  const store = createServerStore({port: 1002})
  store.start()
  const ws = new WS('ws://127.0.0.1:1002')
  ws.on('message', (data) => {
    const action = JSON.parse(data.toString())
    if (action.type === LOGIN_RESULT) {
      ws.send(JSON.stringify({type: 'BOOMERANG', $doc: 'test'}))
    } else {
      expect(action.type).toBe('BOOMERANG')
      ws.close()
      store.stop()
      done()
    }
  })
  ws.on('error', (e) => {
    ws.close()
    store.stop()
    done(e)
  })
})
