import * as EventEmitter from 'events'
import { Action } from '../../core/index'
import { createOnAction } from './on-action'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
const emitter = new EventEmitter()

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('return a func', () => {
  const pushAction = () => Promise.resolve()
  const onAction = createOnAction(pushAction, emitter)
  expect(typeof onAction).toBe('function')
})

test('add action to storage', () => {
  const calls: any = []
  const pushAction = async (roomId: string, action: Action) => {
    calls.push({roomId, action})
  }
  const action: Action = {type: 'SPLAT', $roomId: 'bob'}
  const onAction = createOnAction(pushAction, emitter)

  onAction('user1', action)

  expect(calls[0].roomId).toBe('bob')
  expect(calls[0].action).toEqual(
    {type: 'SPLAT', $roomId: 'bob', $userId: 'user1'}
  )
})
