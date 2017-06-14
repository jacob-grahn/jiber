import memAccounts from './mem-accounts'

test('it should provide incrementing userIds', async () => {
  expect(await memAccounts()).toEqual({userId: '1'})
  expect(await memAccounts()).toEqual({userId: '2'})
  expect(await memAccounts()).toEqual({userId: '3'})
})
