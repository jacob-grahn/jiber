import { Action } from 'jiber-core'
import { verifyClient } from './verify-client'

test('it should pass the credential to logInRequestHandler', async () => {
  let calls: any[] = []
  const store: any = {
    settings: {
      login: async (req: any, credential: any) => {
        calls.push([req, credential])
        const result = { uid: '' }
        return result
      }
    },
    store: {
      dispatch: (_action: Action) => { /* do nothing */ }
    }
  }
  const cb = (_result: boolean) => { /* do nothing */ }
  const info = {
    origin: '',
    req: { headers: { 'sec-websocket-key': '', 'sec-websocket-protocol': 'abc' } },
    secure: true
  }
  await verifyClient(store)(info, cb)
  expect(calls[0][0]).toEqual(info.req)
  expect(calls[0][1]).toBe('abc')
})
