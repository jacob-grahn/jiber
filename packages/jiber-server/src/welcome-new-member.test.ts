import { OPEN, STATE } from 'jiber-core'
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

const sendToUser = (uid: string, action: any) => {
  calls.push(['sendToUser', uid, action])
}

const store: any = {
  getState: () => {
    return {
      rooms: {
        room1: {
          confirmed: 'hi',
          members: {
            bob: { uid: 'bob' },
            sally: { uid: 'sally' }
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
  welcomeNewMember(store, { type: OPEN, $uid: '1234' })
  welcomeNewMember(store, { type: OPEN, $doc: 'room1' })
  welcomeNewMember(store, { type: OPEN })
  expect(calls).toEqual([])
})

test('ignore actions other than OPEN', () => {
  welcomeNewMember(store, { type: 'ee', $uid: 'user1', $doc: 'room1' })
  expect(calls).toEqual([])
})

test('OPEN actions trigger STATE being sent out', () => {
  welcomeNewMember(store, {
    type: OPEN,
    $uid: 'user1',
    $doc: 'room1'
  })
  expect(calls[0][1]).toEqual('user1')
  expect(calls[0][2]).toEqual(
    {
      type: STATE,
      confirmed: 'hi',
      members: {
        bob: { uid: 'bob' },
        sally: { uid: 'sally' }
      },
      $doc: 'room1'
    }
  )
})

test('non-existant rooms are ignored', () => {
  welcomeNewMember(store, {
    type: OPEN,
    $uid: 'user1',
    $doc: 'room500'
  })
  expect(calls).toEqual([])
})
