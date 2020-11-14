import { runCardGame } from './index'

test('chat history', async () => {
  const state = await runCardGame()
  const expectedState = {name: 'bloop'}
  expect(state.state1.messages).toEqual(expectedState)
  expect(state.state2.messages).toEqual(expectedState)
})
