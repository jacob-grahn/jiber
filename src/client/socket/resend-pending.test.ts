import resendPending from './resend-pending'

let sentActions: any[]
const sendAction = (action: any) => sentActions.push(action)

beforeEach(() => {
  sentActions = []
})

test('do nothing if the room does not exist', () => {
  const getState = (): any => {
    return {
      rooms: {
        room1: {}
      }
    }
  }
  const roomId = 'room2'
  resendPending(sendAction, getState, roomId)
  expect(sentActions.length).toBe(0)
})

test('do nothing if there are no optimistic actions', () => {
  const getState = (): any => {
    return {
      rooms: {
        room1: {
          optimisticActions: []
        }
      }
    }
  }
  const roomId = 'room1'
  resendPending(sendAction, getState, roomId)
  expect(sentActions.length).toBe(0)
})

test('send optimistic actions from the roomId', () => {
  const getState = (): any => {
    return {
      rooms: {
        room1: {
          optimisticActions: [{type: 'one'}, {type: 'two'}]
        }
      }
    }
  }
  const roomId = 'room1'
  resendPending(sendAction, getState, roomId)
  expect(sentActions).toEqual([{type: 'one'}, {type: 'two'}])
})
