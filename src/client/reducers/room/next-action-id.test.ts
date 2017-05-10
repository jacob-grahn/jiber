import nextActionId from './next-action-id'

test('total base actionId with optimistic actions', () => {
  const state = {
    actionIds: {sue: 100},
    actions: [{userId: 'sue'}, {userId: 'sue'}, {}, {userId: 'bob'}]
  }
  expect(nextActionId(state, 'sue')).toEqual(103)
})
