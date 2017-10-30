import { JOIN_ROOM, CONFIRMED_STATE } from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'

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

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a roomId and userid', () => {
  welcomeNewMember(store, {type: JOIN_ROOM, $u: '1234'})
  welcomeNewMember(store, {type: JOIN_ROOM, $r: 'room1'})
  welcomeNewMember(store, {type: JOIN_ROOM})
  expect(calls).toEqual([
    ['next'],
    ['next'],
    ['next']
  ])
})

test('ignore actions other than JOIN_ROOM', () => {
  welcomeNewMember(store, {type: 'ee', $u: 'user1', $r: 'room1'})
  expect(calls).toEqual([
    ['next']
  ])
})

test('JOIN_ROOM actions trigger CONFIRMED_STATE being sent out', () => {
  welcomeNewMember(store, {
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room1'
  })
  expect(calls[1]).toEqual([
    'emitter',
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
  welcomeNewMember(store, {
    type: JOIN_ROOM,
    $u: 'user1',
    $r: 'room500'
  })
  expect(calls).toEqual([
    ['next']
  ])
})
