import {
  SET,
  DELETE,
  ADD,
  PUSH,
  SPLICE,
  swiss
} from './swiss'

const $user = { uid: 'Sun', grantWrite: [''] }

test(SET, () => {
  const action = { type: SET, path: 'flavor', value: 'mint', $user }
  expect(swiss(undefined, action)).toEqual({ flavor: 'mint' })
})

test(DELETE, () => {
  const state = { desert: 'brownies' }
  const action = { type: DELETE, path: 'desert', $user }
  expect(swiss(state, action)).toEqual({})
})

test(ADD, () => {
  const state = { loginAttempts: 55 }
  const action = { type: ADD, path: 'loginAttempts', value: 1, $user }
  expect(swiss(state, action)).toEqual({ loginAttempts: 56 })
})

test(PUSH, () => {
  const state = { peeps: ['Antman', 'Batman'] }
  const action = { type: PUSH, path: 'peeps', value: ['Catman', 'Datman'], $user }
  expect(swiss(state, action)).toEqual({ peeps: ['Antman', 'Batman', 'Catman', 'Datman'] })
})

test(SPLICE, () => {
  const state = { aria: ['Littlefinger', 'The Mountain'] }
  const action = {
    type: SPLICE,
    path: 'aria',
    start: 0,
    count: 1,
    items: ['Red Lady'],
    $user
  }
  expect(swiss(state, action)).toEqual({ aria: ['Red Lady', 'The Mountain'] })
})
