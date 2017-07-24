import createOptimistic from './optimistic'
import { Action, CONFIRM_ACTION, PATCH } from '../../../core/index'
import ClientRoomState from '../../interfaces/client-room-state'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimistic = createOptimistic(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action = {
    type: 'bet',
    value: '123',
    $hope: {
      actionId: 1
    }
  }
  const roomState: ClientRoomState = {
    optimisticActions: [],
    confirmed: undefined,
    optimistic: state,
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(state, action, roomState)).toEqual('123')
})

test('optimistic state is rebased when confirmed state is PATCHed', () => {
  const state: any = {}
  const action = {type: PATCH}
  const roomState: ClientRoomState = {
    optimisticActions: [],
    confirmed: {someValue: 'yay'},
    optimistic: state,
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(state, action, roomState)).toEqual({someValue: 'yay'})
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const roomState: ClientRoomState = {
    optimisticActions: [
      {
        type: 'test',
        value: '123',
        $hope: {
          actionId: 4,
          userId: 'sally',
          roomId: 'testRoom'
        }
      },
      {
        type: 'test',
        value: '456',
        $hope: {
          actionId: 5,
          userId: 'sally',
          roomId: 'testRoom'
        }
      }
    ],
    confirmed: 'abc',
    optimistic: '',
    members: {},
    lastUpdatedAt: 0
  }
  const action: Action = {
    type: CONFIRM_ACTION,
    action: {
      type: 'test',
      value: 'abc',
      $hope: {
        roomId: 'testRoom',
        userId: 'sally',
        actionId: 3
      }
    }
  }

  const newState = optimistic(roomState.optimistic, action, roomState)
  expect(newState).toEqual('abc123456')
})
