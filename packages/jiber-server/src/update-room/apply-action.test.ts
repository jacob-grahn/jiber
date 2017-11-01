import { Action } from 'jiber-core'
import { createApplyAction } from './apply-action'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatch = (action: Action) => {
  calls.push(['dispatch', action])
}
const sendToRoom = (roomId: string, action: Action) => {
  calls.push(['sendToRoom', roomId, action])
}
const getState = () => {
  return {
    rooms: {
      room1: {
        members: {
          jay: {
            actionId: 54
          }
        }
      }
    },
    users: {},
    sockets: {}
  } as any
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const applyAction = createApplyAction(dispatch, getState, sendToRoom)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply an action and send it out to room members', () => {
  const action = { type: 'hi', $r: 'room1', $id: 55, $u: 'jay' }
  applyAction(action)
  expect(calls).toEqual([
    ['sendToRoom', 'room1', action],
    ['dispatch', action]
  ])
})

test('do not apply an action if actionId is less than the last one', () => {
  const action = { type: 'hi', $r: 'room1', $id: 53, $u: 'jay' }
  applyAction(action)
  expect(calls).toEqual([])
})
