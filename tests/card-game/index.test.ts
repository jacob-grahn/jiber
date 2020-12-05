import { runCardGame } from './index'
import { logic } from './logic'

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

test('card game', async () => {
  const { state1, state2 } = await runCardGame()

  console.log('------------------------state1--------------')
  console.log(state1)
  console.log('------------------------state2--------------')
  console.log(state2)

  await sleep(50)

  expect(state1._logic).toEqual(logic)
  expect(state2._logic).toEqual(logic)

  expect(state1.player1._hand.length).toBe(4)
  expect(state1.player2._hand).toBeUndefined()

  expect(state2.player1._hand).toBeUndefined()
  expect(state2.player2._hand.length).toBe(4)

  expect(state1.player1.points + state1.player2.points).toBe(1)
})
