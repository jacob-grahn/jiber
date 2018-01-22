import { Action } from 'jiber-core'
import { updateDoc } from './update-doc'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const store: any = {
  getState: () => {
    return {
      s: {
        1: {
          members: {
            jay: {
              actionId: 54
            }
          }
        }
      },
      users: {},
      sockets: {}
    }
  },
  socketServer: {
    sendToDoc: (Id: string, action: Action) => {
      calls.push(['sendToDoc', Id, action])
    }
  },
  dispatch: (action: Action) => {
    calls.push(['dispatch', action])
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply an action and send it out to  members', () => {
  const action = { type: 'hi', $doc: '1', $actionId: 55, $uid: 'jay' }
  updateDoc(store, action)
  expect(calls).toEqual([
    ['sendToDoc', '1', action],
    ['dispatch', action]
  ])
})

test('do not apply an action if actionId is less than the last one', () => {
  const action = { type: 'hi', $doc: '1', $actionId: 53, $uid: 'jay' }
  updateDoc(store, action)
  expect(calls).toEqual([])
})
