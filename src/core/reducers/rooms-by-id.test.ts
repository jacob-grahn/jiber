import roomsById from './rooms-by-id'
import { Action } from '../../core/index'

test('defaults to {}', () => {
  const state: any = undefined
  const action: Action = {type: 'weee'}
  const reducer = (state: any): any => state
  const roomsReducer = roomsById(reducer)
  expect(roomsReducer(state, action)).toEqual({})
})

test('passes simple roomId to one reducer', () => {
  const state: any = undefined
  const action: Action = {type: 'test', $hope: 'room1'}
  const reducer = (): any => 'hi there'
  const roomsReducer = roomsById(reducer)
  expect(roomsReducer(state, action)).toEqual({room1: 'hi there'})
})

test('passes $hope object with roomId field to one reducer', () => {
  const state: any = undefined
  const action: Action = {type: 'test', $hope: {roomId: 'room2'}}
  const reducer = (): any => 'hi there'
  const roomsReducer = roomsById(reducer)
  expect(roomsReducer(state, action)).toEqual({room2: 'hi there'})
})

test('passes complex roomId to one of many reducers', () => {
  const state: any = undefined
  const action: Action = {type: 'test', $hope: 'chat.room1'}
  const chatReducer = (): any => 'talk talk'
  const drawReducer = (): any => 'draw draw'
  const roomsReducer = roomsById({
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
  const action1: Action = {type: 'test', $hope: 'chat.blu', text: 'abc'}
  const action2: Action = {type: 'test', $hope: 'draw.red', text: 'zzz'}
  const chat = (state: any, action: Action): any => state + action.text
  const draw = (state: any, action: Action): any => state + action.text
  const roomsReducer = roomsById({chat, draw})
  const state2 = roomsReducer(state, action1)
  const state3 = roomsReducer(state2, action2)
  expect(state3).toEqual({
    chat: {blu: 'cccabc', org: 'ooo'},
    draw: {red: 'dddzzz'}
  })
})
