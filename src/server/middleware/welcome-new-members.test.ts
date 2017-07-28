import { Action, JOIN_ROOM, CONFIRMED_STATE } from '../../core/index'
import createWelcomeNewMembers from './welcome-new-members'

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
          members: ['bob', 'sally']
        }
      }
    }
  }
}
const sendToUser = (userId: string, action: Action) => {
  calls.push(['sendToUser', userId, action])
}
const next = () => calls.push(['next'])

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const welcomeNewMembers = createWelcomeNewMembers(sendToUser)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a roomId and userid', () => {
  welcomeNewMembers(store)(next)({type: JOIN_ROOM, $hope: {userId: '1234'}})
  welcomeNewMembers(store)(next)({type: JOIN_ROOM, $hope: {roomId: 'room1'}})
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
    $hope: {userId: 'user1', roomId: 'room1'}}
  )
  expect(calls).toEqual([
    ['next']
  ])
})

test('JOIN_ROOM actions trigger CONFIRMED_STATE being sent out', () => {
  welcomeNewMembers(store)(next)({
    type: JOIN_ROOM,
    $hope: {userId: 'user1', roomId: 'room1'}}
  )
  const callAction = calls[1][2]
  expect(callAction.type).toBe(CONFIRMED_STATE)
  expect(callAction.confirmed).toEqual('hi')
  expect(callAction.members).toEqual(['bob', 'sally'])
  expect(callAction.$hope.roomId).toEqual('room1')
})

test('non-existant rooms are ignored', () => {
  welcomeNewMembers(store)(next)({
    type: JOIN_ROOM,
    $hope: {userId: 'user1', roomId: 'room500'}}
  )
  expect(calls).toEqual([
    ['next']
  ])
})
