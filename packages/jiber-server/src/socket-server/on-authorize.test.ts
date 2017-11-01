import { Action } from 'jiber-core'
import { onAuthorize } from './on-authorize'

test('it should pass the credential to logInRequestHandler', async () => {
  let receivedCredential: any
  const store: any = {
    settings: {
      login: async (credential: any) => {
        receivedCredential = credential
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
  expect(receivedCredential).toBe('abc')
})
