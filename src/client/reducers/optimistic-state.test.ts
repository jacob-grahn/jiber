import createOptimisticState from './optimistic-state'
import { CLIENT, PEER, SERVER } from '../../core/index'
import HopeAction from '../interfaces/hope-action'

const adder = (state: any = '', action: HopeAction): any => {
  return state + action.value
}
const optimisticState = createOptimisticState(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action: HopeAction = {
    type: 'test',
    value: '123',
    $hope: {
      actionId: 1,
      roomId: '',
      userId: '',
      source: PEER
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
          source: CLIENT
        }
      } as HopeAction,
      {
        type: 'test',
        value: '456',
        $hope: {
          actionId: 5,
          userId: 'sally',
          roomId: 'testRoom',
          source: CLIENT
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
      source: SERVER
    }
  }

  const newState = optimisticState(roomState.optimisticState, action, roomState)
  expect(newState).toEqual('abc123456')
})
