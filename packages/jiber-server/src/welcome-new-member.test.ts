import { JOIN_ROOM, CONFIRMED_STATE } from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import * as sts from './socket-server/send-to-socket'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const stsa = sts as any
let calls: any[] = []

beforeEach(() => {
  calls = []
  stsa._sendToSocket = sts.sendToSocket
  stsa.sendToSocket = (getState: any, socketId: any, action: any) => {
    calls.push([getState, socketId, action])
  }
})

afterEach(() => {
 stsa._sendToSocket = sts.sendToSocket
})

const sendToUser = (userId: string, action: any) => {
  calls.push(['sendToUser', userId, action])
}

const store: any = {
  getState: () => {
    return {
      rooms: {
        room1: {
          confirmed: 'hi',
          members: {
            bob: {userId: 'bob'},
            sally: {userId: 'sally'}
          }
        }
      }
    }
  },
  socketServer: { sendToUser }
}

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a roomId and userid', () => {
  welcomeNewMember(store, {type: JOIN_ROOM, $u: '1234'})
  welcomeNewMember(store, {type: JOIN_ROOM, $r: 'room1'})
  welcomeNewMember(store, {type: JOIN_ROOM})
  expect(calls).toEqual([])
})

test('ignore actions other than JOIN_ROOM', () => {
  welcomeNewMember(store, {type: 'ee', $u: 'user1', $r: 'room1'})
  expect(calls).toEqual([])
})

test('JOIN_ROOM actions trigger CONFIRMED_STATE being sent out', () => {
  welcomeNewMember(store, {
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room1'
  })
  expect(calls[0][1]).toEqual('user1')
  expect(calls[0][2]).toEqual(
    {
      type: CONFIRMED_STATE,
      confirmed: 'hi',
      members: {
        bob: {userId: 'bob'},
        sally: {userId: 'sally'}
      },
      $r: 'room1'
    }
  )
})

test('non-existant rooms are ignored', () => {
  welcomeNewMember(store, {
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room500'
  })
  expect(calls).toEqual([])
})
