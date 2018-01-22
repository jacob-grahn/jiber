import { memAccounts } from './mem-accounts'

test('it should provide random uids', async () => {
  const account1 = await memAccounts()
  const account2 = await memAccounts()
  expect(account1.uid.length).toEqual(12)
  expect(account2.uid.length).toEqual(12)
  expect(account1).not.toEqual(account2)
})
