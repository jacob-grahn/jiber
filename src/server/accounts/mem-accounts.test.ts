import memAccounts from './mem-accounts'

test('it should provide incrementing userIds', async () => {
  expect(await memAccounts({type: 'login'})).toEqual({id: '1', data: {}})
  expect(await memAccounts({type: 'login'})).toEqual({id: '2', data: {}})
  expect(await memAccounts({type: 'login'})).toEqual({id: '3', data: {}})
})
