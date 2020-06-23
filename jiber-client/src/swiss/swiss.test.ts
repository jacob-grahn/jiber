import {
  SET,
  DELETE,
  ADD,
  PUSH,
  SPLICE,
  swiss
} from './swiss'

test(SET, () => {
  const action = { type: SET, path: 'flavor', value: 'mint' }
  expect(swiss(undefined, action)).toEqual({ flavor: 'mint' })
})

test(DELETE, () => {
  const state = { desert: 'brownies' }
  const action = { type: DELETE, path: 'desert' }
  expect(swiss(state, action)).toEqual({})
})

test(ADD, () => {
  const state = { loginAttempts: 55 }
  const action = { type: ADD, path: 'loginAttempts', value: 1 }
  expect(swiss(state, action)).toEqual({ loginAttempts: 56 })
})

test(PUSH, () => {
  const state = { peeps: ['Antman', 'Batman'] }
  const action = { type: PUSH, path: 'peeps', value: ['Catman', 'Datman'] }
  expect(swiss(state, action)).toEqual({ peeps: ['Antman', 'Batman', 'Catman', 'Datman'] })
})

test('PUSH string on to empty value', () => {
  const state = {}
  const action = { type: PUSH, path: 'games', value: ['clue'] }
  expect(swiss(state, action)).toEqual({ games: ['clue'] })
})

test(SPLICE, () => {
  const state = { aria: ['Littlefinger', 'The Mountain'] }
  const action = {
    type: SPLICE,
    path: 'aria',
    start: 0,
    count: 1,
    items: ['Red Lady']
  }
  expect(swiss(state, action)).toEqual({ aria: ['Red Lady', 'The Mountain'] })
})

test('set root level', () => {
  const state = { say: 'yay' }
  const action = {
    type: SET,
    path: '',
    value: ['bloops']
  }
  expect(swiss(state, action)).toEqual(['bloops'])
})
