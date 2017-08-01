import { Action, CONFIRM_ACTION } from '../../core/index'
import createDispatchAction from './dispatch-action'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatch = (action: Action) => calls.push(action)

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const dispatchAction = createDispatchAction(dispatch)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('actions starting with "hope/" are dispatched as-is', () => {
  dispatchAction({type: 'hope/TEST'})
  expect(calls).toEqual([{type: 'hope/TEST'}])
})

test('other actions with a roomId are wrapped in CONFIRM_ACTION', () => {
  dispatchAction({type: 'SOME_EVENT', $roomId: 'aRoom'})
  expect(calls).toEqual([{
    type: CONFIRM_ACTION,
    $roomId: 'aRoom',
    action: {
      type: 'SOME_EVENT',
      $roomId: 'aRoom'
    }
  }])
})

test('ignore other actions that do not have a roomId', () => {
  dispatchAction({type: 'SOME_EVENT'})
  expect(calls).toEqual([])
})
