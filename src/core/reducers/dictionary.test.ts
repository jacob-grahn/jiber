import dictionary from './dictionary'

const adder = (state: number = 0): number => state + 1

test('state should default to empty object', () => {
  const reducer = dictionary(adder, 'id')
  const state = undefined
  const action = {type: 'what'}
  expect(reducer(state, action)).toEqual({})
})

test('it should index reducer by the supplied id', () => {
  const reducer = dictionary(adder, 'id')
  const state = {}
  const action = {type: 'what', id: 'room1'}
  expect(reducer(state, action)).toEqual({room1: 1})
})

test('return unchanged state if id is not in the action', () => {
  const reducer = dictionary(adder, 'id')
  const state = {}
  const action = {type: 'what'}
  expect(reducer(state, action)).toEqual({})
})
