import memAccounts from './mem-accounts'

test('it should provide incrementing userIds', async () => {
  expect(await memAccounts()).toEqual({id: '1', data: {}})
  expect(await memAccounts()).toEqual({id: '2', data: {}})
  expect(await memAccounts()).toEqual({id: '3', data: {}})
})
