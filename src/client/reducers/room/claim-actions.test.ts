import { claimActions } from './actions'

test('add userId to actions that do not have one', () => {
  const list = [
    {},
    {type: 'WEE'},
    {type: 'WEE', userId: 'bob'}
  ]
  expect(claimActions(list, 'sue')).toEqual([
    {userId: 'sue'},
    {type: 'WEE', userId: 'sue'},
    {type: 'WEE', userId: 'bob'}
  ])
})
