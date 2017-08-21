import { roomTypes } from './room-types'
import { Action } from '../interfaces/action'

test('passes roomType.roomId to one of many reducers', () => {
  const state: any = undefined
  const action: Action = {type: 'test', $roomId: 'chat.room1'}
  const chatReducer = (): any => 'talk talk'
  const drawReducer = (): any => 'draw draw'
  const roomsReducer = roomTypes({
    chat: chatReducer,
    draw: drawReducer
  })
  expect(roomsReducer(state, action)).toEqual('talk talk')
})
