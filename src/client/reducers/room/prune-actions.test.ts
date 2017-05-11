import pruneActions from './prune-actions'

test('return actions that have a userId and actionId', () => {
  const actions = [
    null,
    false,
    {},
    {actionId: 1},
    {userId: 1}
  ]
  expect(pruneActions(actions, 'bob', 1)).toEqual([])
})

test('return actions that match userId and have a greater actionId', () => {
  const actions = [
    {actionId: 1, userId: 'bob'},
    {actionId: 2, userId: 'bob'},
    {actionId: 3, userId: 'bob'},
    {actionId: 1, userId: 'sue'}
  ]
  const userId = 'bob'
  const actionId = 2
  expect(pruneActions(actions, userId, actionId)).toEqual([
    {actionId: 3, userId: 'bob'},
    {actionId: 1, userId: 'sue'}
  ])
})
