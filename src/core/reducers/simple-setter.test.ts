import {default as simpleSetter} from './simple-setter'

test('default to empty object', () => {
  const state = undefined
  const action = {type: 'wee'}
  expect(simpleSetter(state, action)).toEqual({})
})

test('copy data from action to state', () => {
  const state = {something: 'good'}
  const action = {type: 'SET', key: 'food', value: 'good'}
  expect(simpleSetter(state, action)).toEqual({something: 'good', food: 'good'})
})

test('an empty data object is safely handled', () => {
  const state = {something: 'good'}
  const action = {type: 'SET'}
  expect(simpleSetter(state, action)).toEqual({something: 'good'})
})

test('set action creator works', () => {
  const action = {type: 'SET', key: 'name', value: 'bob'}
  expect(simpleSetter(undefined, action)).toEqual({name: 'bob'})
})
