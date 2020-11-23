import { runCardGame } from './index'

test('card game', async () => {
  const {state1, state2} = await runCardGame()
  const expectedState = {name: 'bloop'}
  expect(state1).toEqual(expectedState)
  expect(state2).toEqual(expectedState)
})
