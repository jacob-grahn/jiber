import { combineReducers } from './combine-reducers'
import { Action } from '../interfaces/action'

const reducer = (state: string = '', action: Action) => action.str || state

test('default to an empty object', () => {
  const topReducer = combineReducers({})
  const newState = topReducer(undefined, { type: 'init' })
  expect(newState).toEqual({})
})

test('pass actions to slice reducers', () => {
  const topReducer = combineReducers({ one: reducer, two: reducer })
  const newState = topReducer(undefined, { type: 'test', str: '123' })
  expect(newState).toEqual({ one: '123', two: '123' })
})
