import { updateRoom } from './update-room'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
beforeEach(() => calls = [])

const store: any = {
  getState: () => {
    return {
      rooms: {
        room1: {
          lastUpdatedAt: 0,
          members: {
            bob: { userId: 'bob' }
          }
        }
      }
    }
  },
  dispatch: (action: any) => {
    calls.push(['dispatch', action])
  },
  socketServer: {
    sendToRoom: (roomId: string, action: any) => {
      calls.push(['sendToRoom', roomId, action])
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply actions', async () => {
  const action = { type: 'action1', $r: 'room1', $u: 'bob' }
  await updateRoom(store, action)
  expect(calls).toEqual([
    ['sendToRoom', 'room1', action],
    ['dispatch', action]
  ])
})
