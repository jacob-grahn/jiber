import { Action } from 'jiber-core'
import { createOptimistic } from './optimistic'
import { ClientRoomState } from './client-room'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimistic = createOptimistic(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action = {
    type: 'bet',
    value: '123',
    $actionId: 1
  }
  const roomState: ClientRoomState = {
    pendingActions: [],
    confirmed: undefined,
    optimistic: state,
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(roomState, action)).toEqual('123')
})

test('an optimistic action coming in after a confirmed action is ignored', () => {
  const action = {
    type: 'add',
    value: '2',
    $actionId: 5,
    $user: { userId: 'bob', actionId: 5 }
  }
  const roomState: ClientRoomState = {
    pendingActions: [],
    confirmed: '2',
    optimistic: '2',
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(roomState, action)).toEqual('2')
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const roomState: ClientRoomState = {
    pendingActions: [
      {
        type: 'test',
        value: '123',
        $actionId: 4,
        $userId: 'sally',
        $roomId: 'testRoom'
      },
      {
        type: 'test',
        value: '456',
        $actionId: 5,
        $userId: 'sally',
        $roomId: 'testRoom'
      }
    ],
    confirmed: 'abc',
    optimistic: '',
    members: {},
    lastUpdatedAt: 0
  }
  const action: Action = {
    type: 'test',
    value: 'abc',
    $roomId: 'testRoom',
    $userId: 'sally',
    $actionId: 3,
    $confirmed: true
  }

  const newState = optimistic(roomState, action)
  expect(newState).toEqual('abc123456')
})
