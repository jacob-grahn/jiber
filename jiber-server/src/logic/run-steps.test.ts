import { runSteps } from './run-steps'

test('ADD', () => {
  const state: any = {
    _logic: {
      TEST: [
        ['ADD', 'count', 1],
        ['ADD', 'minions', 3]
      ]
    },
    count: 5
  }
  const action = { type: 'TEST' }
  const actions = runSteps(state, action)
  expect(actions).toEqual([
    { type: 'ADD', path: 'count', value: 1 },
    { type: 'ADD', path: 'minions', value: 3 }
  ])
})

test('CHECK', () => {
  const state: any = {
    _logic: {
      TEST: [
        ['CHECK', 1, '<', 2],
        ['SET', 'building.age', 7],
        ['CHECK', 1, '>', 2],
        ['SET', 'building.color', 'blue']
      ]
    },
    arr: [1, 2, 3]
  }
  const action = { type: 'TEST' }
  const actions = runSteps(state, action)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('IF', () => {
  const state: any = {
    _logic: {
      TEST: [
        ['IF', 1, '>', 2, [
          ['SET', 'building.color', 'blue']
        ]],
        ['IF', 1, '<', 2, [
          ['SET', 'building.age', 7]
        ]]
      ]
    }
  }
  const action = { type: 'TEST' }
  const actions = runSteps(state, action)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('IF else', () => {
  const state: any = {
    _logic: {
      TEST: [
        ['IF', 1, '>', 2, [
          ['SET', 'building.color', 'blue']
        ], [
          ['SET', 'building.age', 7]
        ]]
      ]
    }
  }
  const action = { type: 'TEST' }
  const actions = runSteps(state, action)
  expect(actions).toEqual([
    { type: 'SET', path: 'building.age', value: 7 }
  ])
})

test('RUN', () => {
  const state: any = {
    _logic: {
      TEST: [
        ['RUN', 'GROW_TREE'],
        ['RUN', 'GROW_BUSHES']
      ],
      GROW_TREE: [
        ['ADD', 'treeCount', 1]
      ],
      GROW_BUSHES: [
        ['ADD', 'redBushCount', 1],
        ['ADD', 'greenBushCount', 2]
      ]
    }
  }
  const action = { type: 'TEST' }
  const actions = runSteps(state, action)
  expect(actions).toEqual([
    { type: 'ADD', path: 'treeCount', value: 1 },
    { type: 'ADD', path: 'redBushCount', value: 1 },
    { type: 'ADD', path: 'greenBushCount', value: 2 }
  ])

  // make sure logic is not mutated
  expect(state._logic.TEST.length).toBe(2) 
})
