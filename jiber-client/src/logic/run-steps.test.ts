import { runSteps } from './run-steps'

test('SET', () => {
  const state: any = {}
  const steps = [
    ['SET', 'building.age', 7]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([{ type: 'SET', path: 'building.age', value: 7 }])
})

test('ADD', () => {
  const state: any = { count: 5 }
  const steps = [
    ['ADD', 'count', 1],
    ['ADD', 'minions', 3]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([
    { type: 'ADD', path: 'count', value: 1 },
    { type: 'ADD', path: 'minions', value: 3 }
  ])
})

test('PUSH', () => {
  const state: any = { arr: [1, 2] }
  const steps = [
    ['PUSH', 'arr', [3]]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([{ type: 'PUSH', path: 'arr', value: [3] }])
})

test('POP', () => {
  const state: any = { arr: [1, 2] }
  const steps = [
    ['POP', 'arr', 'result']
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([{
    type: 'SPLICE',
    path: 'arr',
    destPath: 'result',
    start: -1,
    count: 1
  }])
})

test('SPLICE', () => {
  const state: any = { arr: [1, 2, 3] }
  const steps = [
    ['SPLICE', 'arr', 1, 1, 'result', 5, 5, 5]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([
    { type: 'SPLICE', path: 'arr', destPath: 'result', start: 1, count: 1, items: [5, 5, 5] }
  ])
})

test('CHECK', () => {
  const state: any = { arr: [1, 2, 3] }
  const steps = [
    ['CHECK', 1, '<', 2],
    ['SET', 'building.age', 7],
    ['CHECK', 1, '>', 2],
    ['SET', 'building.color', 'blue']
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('IF', () => {
  const state: any = {}
  const steps = [
    ['IF', 1, '>', 2, [
      ['SET', 'building.color', 'blue']
    ]],
    ['IF', 1, '<', 2, [
      ['SET', 'building.age', 7]
    ]]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('IF else', () => {
  const state: any = {}
  const steps = [
    ['IF', 1, '>', 2, [
      ['SET', 'building.color', 'blue']
    ], [
      ['SET', 'building.age', 7]
    ]]
  ]
  const actions = runSteps(state, steps, null)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('RUN', () => {
  const state: any = {}
  const logic = {
    GROW_TREE: [
      ['ADD', 'treeCount', 1]
    ],
    GROW_BUSHES: [
      ['ADD', 'redBushCount', 1],
      ['ADD', 'greenBushCount', 2]
    ]
  }
  const steps = [
    ['RUN', 'GROW_TREE'],
    ['RUN', 'GROW_BUSHES']
  ]
  const actions = runSteps(state, steps, logic)
  expect(actions).toEqual([
    { type: 'ADD', path: 'treeCount', value: 1 },
    { type: 'ADD', path: 'redBushCount', value: 1 },
    { type: 'ADD', path: 'greenBushCount', value: 2 }
  ])
})
