import optimisticStateFactory from './optimistic-state'
import { Action, CLIENT, SERVER } from '../../../core/index'
import { RoomState } from './room'
import HopeAction from '../../interfaces/hope-action'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimisticState = optimisticStateFactory(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  const roomState = {
    optimisticActions: [],
    confirmedState: undefined,
    optimisticState: {},
  }
  expect(optimisticState(roomState, state, action)).toEqual('123')
})

test('optimistic state is recalculated when confirmed state is updated', () => {
  const roomState = {
    optimisticActions: [
      {
        $hope: {
          actionId: 4,
          userId: 'sally',
          roomId: 'testRoom',
          source: CLIENT
        },
        type: 'test',
        value: '123'
      } as HopeAction,
      {
        $hope: {
          actionId: 5,
          userId: 'sally',
          roomId: 'testRoom',
          source: CLIENT
        },
        type: 'test',
        value: '456'
      } as HopeAction
    ],
    confirmedState: 'abc',
    optimisticState: 'abc123456',
  }
  const action: Action = {
    type: 'test',
    value: 'abc',
    $hope: {
      roomId: 'testRoom',
      userId: 'sally',
      actionId: 3,
      source: SERVER
    }
  }

  const newState = optimisticState(roomState, roomState.optimisticState, action)
  expect(newState).toEqual('abc123456')
})
