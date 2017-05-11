import nextActionId from './next-action-id'

test('total base actionId with optimistic actions', () => {
  const state = {
    actionIds: {sue: 100},
    actions: [{userId: 'sue'}, {userId: 'sue'}, {}, {userId: 'bob'}]
  }
  expect(nextActionId('sue', state)).toEqual(103)
})

test('ignore falsy actions', () => {
  const state = {
    actionIds: {sue: 100},
    actions: [null] as any[]
  }
  expect(nextActionId('sue', state)).toEqual(101)
})

test('default next actionId to 1', () => {
  const state = {}
  expect(nextActionId('sue', state)).toEqual(1)
})
