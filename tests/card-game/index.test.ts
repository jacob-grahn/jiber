import { runCardGame } from './index'
import { logic } from './logic'

test('card game', async () => {
  const { state1, state2 } = await runCardGame()
  const expectedState = {
    _logic: logic,
    player1: {
      _hand: [],
      score: 5
    },
    player2: {
      _hand: [],
      score: 7
    }
  }
  expect(state1).toEqual(expectedState)
  expect(state2).toEqual(expectedState)
})
