import { runCardGame } from './index'
import { logic } from './logic'

test('card game', async () => {
  const {state1, state2} = await runCardGame()
  const expectedState = {_logic: logic}
  expect(state1).toEqual(expectedState)
  expect(state2).toEqual(expectedState)
})
