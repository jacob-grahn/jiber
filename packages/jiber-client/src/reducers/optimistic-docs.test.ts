import { Action, SERVER } from 'jiber-core'
import { optimisticDocs } from './optimistic-docs'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('user generated actions are used on the optimistic state', () => {
  const action = {
    type: 'bet',
    value: '123',
    $doc: 'doc1',
    $$optimisticActions: [],
    $$docState: undefined
  }
  const optimisticState = undefined
  const newOptimisticState = optimisticDocs(adder)(optimisticState, action)
  expect(newOptimisticState).toEqual({ doc1: '123' })
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const action: Action = {
    type: 'test',
    value: 'abc',
    $doc: 'testDoc',
    $src: SERVER,
    $$optimisticActions: [
      { type: 'test', value: '123', $doc: 'testDoc' },
      { type: 'test', value: '456', $doc: 'testDoc' }
    ],
    $$docState: {
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
    $doc: 'doc1',
    $uid: 'sally',
    $src: SERVER,
    $$docState: docState,
    $$optimisticActions: [
      { type: 'add', $doc: 'testDoc', ammount: 100 }
    ]
  }

  const newOptimisticState = optimisticDocs(mutateReducer)(optimisticState, action)
  expect(newOptimisticState).toEqual({ doc1: { count: 105 } })
  expect(docState).toEqual({ doc1: { count: 5 } })
})
