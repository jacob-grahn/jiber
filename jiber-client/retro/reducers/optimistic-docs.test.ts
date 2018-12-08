import { Action } from '../interfaces'
import { SERVER } from '../constants'
import { optimisticDocs } from './optimistic-docs'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('user generated actions are used on the optimistic state', () => {
  const action = {
    type: 'bet',
    value: '123',
    $docId: 'doc1',
    $$optimisticActions: [],
    $$docIds: undefined
  }
  const optimisticState = undefined
  const newOptimisticState = optimisticDocs(adder)(optimisticState, action)
  expect(newOptimisticState).toEqual({ doc1: '123' })
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const action: Action = {
    type: 'test',
    value: 'abc',
    $docId: 'testDoc',
    $src: SERVER,
    $$optimisticActions: [
      { type: 'test', value: '123', $docId: 'testDoc' },
      { type: 'test', value: '456', $docId: 'testDoc' }
    ],
    $$docIds: {
      testDoc: 'abc'
    }
  }

  const optimisticState = { testDoc: '' }
  const newOptimisticState = optimisticDocs(adder)(optimisticState, action)
  expect(newOptimisticState).toEqual({ testDoc: 'abc123456' })
})

test('do not mutate the original confirmed state', () => {
  const mutateReducer = (state = { count: 0 }, action: any) => {
    state.count += action.ammount
    return state
  }
  const docState = { doc1: { count: 5 } }
  const optimisticState = { doc1: { count: 5 } }
  const action: Action = {
    type: 'test',
    $docId: 'doc1',
    $userId: 'sally',
    $src: SERVER,
    $$docIds: docState,
    $$optimisticActions: [
      { type: 'add', $docId: 'testDoc', ammount: 100 }
    ]
  }

  const newOptimisticState = optimisticDocs(mutateReducer)(optimisticState, action)
  expect(newOptimisticState).toEqual({ doc1: { count: 105 } })
  expect(docState).toEqual({ doc1: { count: 5 } })
})
