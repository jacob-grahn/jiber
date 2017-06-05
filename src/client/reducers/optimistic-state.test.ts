import createOptimisticState from './optimistic-state'
import { HopeAction, CLIENT, PEER, SERVER } from '../../core/index'
import { OPTIMISTIC_ACTION } from './room-actions'

const adder = (state: any = '', action: HopeAction): any => {
  return state + action.value
}
const optimisticState = createOptimisticState(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action: HopeAction = {
    type: OPTIMISTIC_ACTION,
    value: '123',
    $hope: {
      actionId: 1,
      roomId: '',
      userId: '',
      source: PEER,
      timeMs: 0
    }
  }
  const roomState = {
    optimisticActions: [],
    confirmedState: undefined,
    optimisticState: state
  }
  expect(optimisticState(state, action, roomState)).toEqual('123')
})

test('optimistic state is recalculated when confirmed state is updated', () => {
  const roomState = {
    optimisticActions: [
      {
        type: 'test',
        value: '123',
        $hope: {
          actionId: 4,
          userId: 'sally',
          roomId: 'testRoom',
          source: CLIENT,
          timeMs: 0
        }
      } as HopeAction,
      {
        type: 'test',
        value: '456',
        $hope: {
          actionId: 5,
          userId: 'sally',
          roomId: 'testRoom',
          source: CLIENT,
          timeMs: 0
        }
      } as HopeAction
    ],
    confirmedState: 'abc',
    optimisticState: 'abc123456'
  }
  const action: HopeAction = {
    type: 'test',
    value: 'abc',
    $hope: {
      roomId: 'testRoom',
      userId: 'sally',
      actionId: 3,
      source: SERVER,
      timeMs: 0
    }
  }

  const newState = optimisticState(roomState.optimisticState, action, roomState)
  expect(newState).toEqual('abc123456')
})
