import { Action } from 'jiber-core'
import { onAuthorize } from './on-authorize'

test('it should pass the credential to logInRequestHandler', async () => {
  let calls: any[] = []
  const store: any = {
    settings: {
      login: async (req: any, credential: any) => {
        calls.push([req, credential])
        const result = { userId: '' }
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
  await onAuthorize(store, info, cb)
  expect(calls[0][0]).toEqual(info.req)
  expect(calls[0][1]).toBe('abc')
})
