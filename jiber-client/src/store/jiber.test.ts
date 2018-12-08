/* global test, expect */

import { Jiber } from './jiber'
import { Reducer } from '../interfaces/reducer'

const nameReducer: Reducer = (state = '', packet) => packet.name || state

test('it should provide a dispatch and getState method', () => {
  const jiber = new Jiber({ reducer: nameReducer })
  expect(jiber.getState).toBeTruthy()
  expect(jiber.dispatch).toBeTruthy()
})
