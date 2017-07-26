import { JOIN_ROOM } from '../../core/index'
import rejoinRooms from './rejoin-rooms'

test('send a join action for each room in the state', () => {
  const getState = (): any => {
    return ({
      rooms: {
        room1: {},
        room2: {}
      },
      users: {},
      lastUpdatedAt: 0
    })
  }

  let sentActions: any[] = []
  const sendAction = (action: any) => sentActions.push(action)

  rejoinRooms(sendAction, getState)

  expect(sentActions).toEqual([
    {type: JOIN_ROOM, $hope: {roomId: 'room1'}},
    {type: JOIN_ROOM, $hope: {roomId: 'room2'}}
  ])
})
