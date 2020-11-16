import { runCardGame } from './index'

test('card game', async () => {
  const state = await runCardGame()
  const expectedState = {name: 'bloop'}
  expect(state.state1).toEqual(expectedState)
  expect(state.state2).toEqual(expectedState)
})
