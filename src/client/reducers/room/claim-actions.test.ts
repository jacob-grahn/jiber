import claimActions from './claim-actions'

test('add userId to actions that do not have one', () => {
  const actions = [
    {},
    {type: 'WEE'},
    {type: 'WEE', userId: 'bob'}
  ]
  expect(claimActions(actions, 'sue')).toEqual([
    {userId: 'sue'},
    {type: 'WEE', userId: 'sue'},
    {type: 'WEE', userId: 'bob'}
  ])
})
