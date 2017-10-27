import { Action, JOIN_ROOM, CONFIRMED_STATE } from 'jiber-core'
import { createWelcomeNewMembers } from './welcome-new-members'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
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
  }
}
const emitter: any = {
  emit: (type: string, userId: string, action: Action) => {
    calls.push(['emitter', type, userId, action])
  }
}
const next = () => calls.push(['next'])

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const welcomeNewMember = createWelcomeNewMembers(emitter)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a roomId and userid', () => {
  welcomeNewMember(store)(next)({type: JOIN_ROOM, $u: '1234'})
  welcomeNewMember(store)(next)({type: JOIN_ROOM, $r: 'room1'})
  welcomeNewMember(store)(next)({type: JOIN_ROOM})
  expect(calls).toEqual([
    ['next'],
    ['next'],
    ['next']
  ])
})

test('ignore actions other than JOIN_ROOM', () => {
  welcomeNewMember(store)(next)({
    type: 'ee',
    $u: 'user1',
    $r: 'room1'
  })
  expect(calls).toEqual([
    ['next']
  ])
})

test('JOIN_ROOM actions trigger CONFIRMED_STATE being sent out', () => {
  welcomeNewMember(store)(next)({
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room1'
  })
  expect(calls[1]).toEqual([
    'emitter',
    SEND_TO_USER,
    'user1',
    {
      type: CONFIRMED_STATE,
      confirmed: 'hi',
      members: {
        bob: {userId: 'bob'},
        sally: {userId: 'sally'}
      },
      $r: 'room1'
    }
  ])
})

test('non-existant rooms are ignored', () => {
  welcomeNewMember(store)(next)({
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room500'
  })
  expect(calls).toEqual([
    ['next']
  ])
})
