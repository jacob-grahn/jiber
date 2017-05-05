import rooms from './rooms'
import { Action } from '../../core/index'

test('defaults to {}', () => {
  const state: any = undefined
  const action: Action = undefined
  const reducer = (state: any, action: Action): any => state
  const roomsReducer = rooms(reducer)
  expect(roomsReducer(state, action)).toEqual({})
})

test('passes simple hopeRoomId to one reducer', () => {
  const state: any = undefined
  const action: Action = {type: 'test', hopeRoomId: 'room1'}
  const reducer = (state: any, action: Action): any => 'hi there'
  const roomsReducer = rooms(reducer)
  expect(roomsReducer(state, action)).toEqual({room1: 'hi there'})
})

test('passes complex hopeRoomId to one of many reducers', () => {
  const state: any = undefined
  const action: Action = {type: 'test', hopeRoomId: 'chat.room1'}
  const chatReducer = (state: any, action: Action): any => 'talk talk'
  const drawReducer = (state: any, action: Action): any => 'draw draw'
  const roomsReducer = rooms({
    chat: chatReducer,
    draw: drawReducer
  })
  expect(roomsReducer(state, action)).toEqual({
    chat: {
      room1: 'talk talk'
    }
  })
})

test('existing state should be used', () => {
  const state: any = {chat: {blu: 'ccc', org: 'ooo'}, draw: {red: 'ddd'}}
  const action1: Action = {type: 'test', hopeRoomId: 'chat.blu', text: 'abc'}
  const action2: Action = {type: 'test', hopeRoomId: 'draw.red', text: 'zzz'}
  const chat = (state: any, action: Action): any => state + action.text
  const draw = (state: any, action: Action): any => state + action.text
  const roomsReducer = rooms({chat, draw})
  const state2 = roomsReducer(state, action1)
  const state3 = roomsReducer(state2, action2)
  expect(state3).toEqual({
    chat: {blu: 'cccabc', org: 'ooo'},
    draw: {red: 'dddzzz'}
  })
})
