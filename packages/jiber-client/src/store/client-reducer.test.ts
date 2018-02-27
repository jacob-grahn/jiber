import { Action, SERVER, STATE } from 'jiber-core'
import { createClientReducer } from './client-reducer'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const clientReducer = createClientReducer(adder)

test('add an optimistic action', () => {
  const state = undefined
  const action = { type: 'test', $docId: 'mydoc', value: '222' }
  const newState = clientReducer(state, action)
  expect(newState.optimisticDocs.mydoc).toBe('222')
  expect(newState.optimisticActions[0]).toBe(action)
})

test('add a confirmed action', () => {
  const state = {
    docs: {
      mydoc: '123'
    },
    optimisticDocs: {
      mydoc: '123456'
    },
    optimisticActions: [
      { $docId: 'mydoc', value: '4', $madeAt: 4, $userId: 'paul' },
      { $docId: 'mydoc', value: '5', $madeAt: 5, $userId: 'paul' },
      { $docId: 'mydoc', value: '6', $madeAt: 6, $userId: 'paul' }
    ]
  }
  const action = { type: 'test', $docId: 'mydoc', value: '4', $madeAt: 4, $src: SERVER, $userId: 'paul' }
  const newState = clientReducer(state, action)
  expect(newState.docs.mydoc).toBe('1234')
  expect(newState.optimisticDocs.mydoc).toBe('123456')
  expect(newState.optimisticActions).toEqual([
    { $docId: 'mydoc', value: '5', $madeAt: 5, $userId: 'paul' },
    { $docId: 'mydoc', value: '6', $madeAt: 6, $userId: 'paul' }
  ])
})

test('add a STATE confirmed action', () => {
  const state = undefined
  const action = { type: STATE, state: { '31,27': '#BD6919' }, $docId: 'draw', $src: SERVER }
  const newState = clientReducer(state, action)
  expect(newState.optimisticDocs.draw).toEqual({ '31,27': '#BD6919' })
})
