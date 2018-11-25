// global test, expect

import { TimeyWimey } from './timey-wimey'
import { Action } from './action'

test ('add a first action', () => {
  const tw = new TimeyWimey()
  const action = new Action({ payload: 'test', time: 5 })
  const { state, actions } = tw.addAction(action)
  expect(state).toBeUndefined()
  expect(actions).toEqual([action])
})

test ('add a sequential action', () => {
  const tw = new TimeyWimey()
  const action1 = new Action({ payload: 'test', time: 5 })
  const action2 = new Action({ payload: 'walk', time: 6 })
  tw.addAction(action1)
  const { state, actions } = tw.addAction(action2)
  expect(state).toBeUndefined()
  expect(actions).toEqual([action1, action2])
})

test ('add an out-of-order action', () => {
  const tw = new TimeyWimey()
  const action1 = new Action({ payload: 'test', time: 5 })
  const action2 = new Action({ payload: 'walk', time: 4 })
  tw.addAction(action1)
  const { state, actions } = tw.addAction(action2)
  expect(state).toBeUndefined()
  expect(actions).toEqual([action2, action1])
})

test ('replace an action', () => {
  const tw = new TimeyWimey()
  const action1 = new Action({ id: 'yay', payload: 'test' })
  const action2 = new Action({ id: 'yay', payload: 'test2', trust: 2 })
  tw.addAction(action1)
  const { state, actions } = tw.addAction(action2)
  expect(state).toBeUndefined()
  expect(actions).toEqual([action2])
})

test ('use snapshots', () => {
  const tw = new TimeyWimey()
  const action1 = new Action({ payload: 'test', time: 5 })
  const action2 = new Action({ payload: 'walk', time: 6 })
  tw.addAction(action1)
  tw.addSnapshot('a-snapshot', 5)
  const { state, actions } = tw.addAction(action2)
  expect(state).toBe('a-snapshot')
  expect(actions).toEqual([action2])
})
