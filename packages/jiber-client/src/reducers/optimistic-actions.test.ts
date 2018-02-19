import { optimisticActions } from './optimistic-actions'
import { STATE, SERVER } from 'jiber-core'

test('prune actions that do not have a uid', () => {
  const actions: any = [{}, { $madeAt: 0 }]
  const action = {
    type: 'lala',
    $uid: '1',
    $src: SERVER
  }
  expect(optimisticActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    { $madeAt: 1, $uid: 'bob' },
    { $madeAt: 2, $uid: 'bob' },
    { $madeAt: 3, $uid: 'bob' },
    { $madeAt: 1, $uid: 'sue' }
  ]
  const action = {
    type: 'wee',
    $uid: 'bob',
    $madeAt: 2,
    $src: SERVER
  }
  expect(optimisticActions(actions, action)).toEqual([
    { $madeAt: 3, $uid: 'bob' },
    { $madeAt: 1, $uid: 'sue' }
  ])
})

test('remove all optimistic actions when STATE is received', () => {
  const list: any = [
    { type: 'WEE', $uid: 'sue', $madeAt: 5 },
    { type: 'WEE', $uid: 'sue', $madeAt: 6 },
    { type: 'WEE', $uid: 'bob', $madeAt: 2 }
  ]
  const action = {
    type: STATE,
    confirmed: {},
    watchers: { sue: { time: 5 } }
  }
  expect(optimisticActions(list, action)).toEqual([])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action = {
    doc: 'draw',
    $madeAt: 1519067435081,
    $src: 'SELF',
    $uid: 'ba112aeb7873',
    $user: { uid: 'ba112aeb7873' },
    color: '#64FDCD',
    path: '5,18',
    type: 'SET_PIXEL'
  }
  const newState = optimisticActions(state, action)
  expect(newState[0].color).toEqual('#64FDCD')
})
