import {
  SET,
  DELETE,
  ADD,
  SUBTRACT,
  PUSH,
  POP,
  SHIFT,
  UNSHIFT,
  SPLICE,
  swiss
} from './swiss'

test(SET, () => {
  const action = {type: SET, path: 'flavor', value: 'mint'}
  expect(swiss(undefined, action)).toEqual({flavor: 'mint'})
})

test(DELETE, () => {
  const state = {desert: 'brownies'}
  const action = {type: DELETE, path: 'desert'}
  expect(swiss(state, action)).toEqual({})
})

test(ADD, () => {
  const state = {loginAttempts: 55}
  const action = {type: ADD, path: 'loginAttempts', value: 1}
  expect(swiss(state, action)).toEqual({loginAttempts: 56})
})

test(SUBTRACT, () => {
  const state = {lives: 9}
  const action = {type: SUBTRACT, path: 'lives', value: 1}
  expect(swiss(state, action)).toEqual({lives: 8})
})

test(PUSH, () => {
  const state = {peeps: ['Antman', 'Batman']}
  const action = {type: PUSH, path: 'peeps', value: ['Catman', 'Datman']}
  expect(swiss(state, action)).toEqual({peeps: ['Antman', 'Batman', 'Catman', 'Datman']})
})

test(POP, () => {
  const state = {datingCandidates: ['Samantha', 'Barbara']}
  const action = {type: POP, path: 'datingCandidates'}
  expect(swiss(state, action)).toEqual({datingCandidates: ['Samantha']})
})

test(SHIFT, () => {
  const state = undefined
  const action = {type: SHIFT, path: 'candies'}
  expect(swiss(state, action)).toEqual({candies: []})
})

test(UNSHIFT, () => {
  const state = {todo: ['Study']}
  const action = {type: UNSHIFT, path: 'todo', value: ['TV', 'Games']}
  expect(swiss(state, action)).toEqual({todo: ['TV', 'Games', 'Study']})
})

test(SPLICE, () => {
  const state = {aria: ['Littlefinger', 'The Mountain']}
  const action = {type: SPLICE, path: 'aria', start: 0, count: 1, items: ['Red Lady']}
  expect(swiss(state, action)).toEqual({aria: ['Red Lady', 'The Mountain']})
})
