import { runSteps } from './run-steps'

test('SET', () => {
  const state: any = {}
  const steps = [
    ['SET', 'building.age', 7]
  ]
  const actions = runSteps(state, steps)
  expect(actions).toEqual([{ type: 'SET', path: 'building.age', value: 7 }])
})

test('ADD', () => {
  const state: any = { count: 5 }
  const steps = [
    ['ADD', 'count', 1]
  ]
  const actions = runSteps(state, steps)
  expect(actions).toEqual([{ type: 'SET', path: 'count', value: 6 }])
})

test('PUSH', () => {
  const state: any = { arr: [1, 2] }
  const steps = [
    ['PUSH', 'arr', [3]]
  ]
  const actions = runSteps(state, steps)
  expect(actions).toEqual([{ type: 'PUSH', path: 'arr', value: [3] }])
})

test('POP', () => {
  const state: any = { arr: [1, 2] }
  const steps = [
    ['POP', 'arr', 'result']
  ]
  const actions = runSteps(state, steps)
  expect(actions).toEqual([
    { type: 'POP', path: 'arr' },
    { type: 'SET', path: 'result', value: 2 }
  ])
})

test('SPLICE', () => {
  const state: any = { arr: [1, 2, 3] }
  const steps = [
    ['SPLICE', 'arr', 1, 1, 'result', 5, 5, 5]
  ]
  const actions = runSteps(state, steps)
  expect(actions).toEqual([
    { type: 'SPLICE', path: 'arr', start: 1, count: 1, items: [5, 5, 5] },
    { type: 'SET', path: 'result', value: [2] }
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
  const actions = runSteps(state, steps)
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
  const actions = runSteps(state, steps)
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
  const actions = runSteps(state, steps)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})
