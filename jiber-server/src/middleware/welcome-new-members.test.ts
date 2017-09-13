import { Action, JOIN_ROOM, CONFIRMED_STATE, SEND_TO_USER } from '../core'
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
const welcomeNewMembers = createWelcomeNewMembers(emitter)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a roomId and userid', () => {
  welcomeNewMembers(store)(next)({type: JOIN_ROOM, $userId: '1234'})
  welcomeNewMembers(store)(next)({type: JOIN_ROOM, $roomId: 'room1'})
  welcomeNewMembers(store)(next)({type: JOIN_ROOM})
  expect(calls).toEqual([
    ['next'],
    ['next'],
    ['next']
  ])
})

test('ignore actions other than JOIN_ROOM', () => {
  welcomeNewMembers(store)(next)({
    type: 'ee',
    $userId: 'user1',
    $roomId: 'room1'
  })
  expect(calls).toEqual([
    ['next']
  ])
})

test('JOIN_ROOM actions trigger CONFIRMED_STATE being sent out', () => {
  welcomeNewMembers(store)(next)({
    type: JOIN_ROOM,
    $userId: 'user1',
    $roomId: 'room1'
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
      $roomId: 'room1'
    }
  ])
})

test('non-existant rooms are ignored', () => {
  welcomeNewMembers(store)(next)({
    type: JOIN_ROOM,
    $userId: 'user1',
    $roomId: 'room500'
  })
  expect(calls).toEqual([
    ['next']
  ])
})
