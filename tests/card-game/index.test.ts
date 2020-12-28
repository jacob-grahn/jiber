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

  await sleep(50)

  const player1Id = state1.player1.$ref.split('.')[1]
  const player2Id = state1.player2.$ref.split('.')[1]

  expect(state1._logic).toEqual(logic)
  expect(state2._logic).toEqual(logic)

  expect(state1.$users[player1Id]._hand.length).toBe(4)
  expect(state1.$users[player2Id]._hand).toBeUndefined()

  expect(state2.$users[player2Id]._hand.length).toBe(4)
  expect(state2.$users[player1Id]._hand).toBeUndefined()

  expect(state1.$users[player1Id].points + state1.$users[player2Id].points).toBe(1)
})
