
import { Action } from '../../core/index'
import LoginResult from '../interfaces/login-result'
import { createOnAuthorize } from './on-authorize'

test('it should pass the credential to logInRequestHandler', async () => {
  let receivedCredential: any
  const dispatch = (_action: Action) => { /* do nothing */ }
  const loginRequestHandler = async (credential: any) => {
    receivedCredential = credential
    const result: LoginResult = {userId: ''}
    return result
  }
  const cb = (_result: boolean) => { /* do nothing */ }
  const onAuthorize = createOnAuthorize(dispatch, loginRequestHandler)
  const info = {
    origin: '',
    req: {headers: {'sec-websocket-key': '', 'sec-websocket-protocol': 'abc'}},
    secure: true
  }
  await onAuthorize(info, cb)
  expect(receivedCredential).toBe('abc')
})
