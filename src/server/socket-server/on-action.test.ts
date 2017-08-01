import { Action } from '../../core/index'
import createOnAction from './on-action'

test('return a function', () => {
  const pushAction = () => Promise.resolve()
  const updateRoom = () => { /* do nothing */ }
  const onAction = createOnAction(pushAction, updateRoom)
  expect(typeof onAction).toBe('function')
})

test('add action to storage', () => {
  const calls: any = []
  const pushAction = async (roomId: string, action: Action) => {
    calls.push({roomId, action})
  }
  const updateRoom = () => { /* do nothing */ }
  const action: Action = {type: 'SPLAT', $roomId: 'bob'}
  const onAction = createOnAction(pushAction, updateRoom)

  onAction('user1', action)

  expect(calls[0].roomId).toBe('bob')
  expect(calls[0].action).toEqual(
    {type: 'SPLAT', $roomId: 'bob', $userId: 'user1'}
  )
})
