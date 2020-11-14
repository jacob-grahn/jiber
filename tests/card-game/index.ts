import JiberClient from 'jiber-client'
import JiberServer from 'jiber-server'
import { logic } from './logic'

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const runCardGame = async (): Promise<{state1: any, state2: any}> => {
  // init
  const server = new JiberServer()
  const client1 = new JiberClient({logic})
  const client2 = new JiberClient({logic})
  const game1 = client1.open('game')
  const game2 = client2.open('game')
  await sleep(50)

  // init player 1
  game1.dispatch({type: "INIT"})
  await sleep(50)

  // init player 2
  game2.dispatch({type: "INIT"})
  await sleep(50)

  // play cards
  game1.dispatch({type: "PLAY_CARD", cardIndex: 0})
  game2.dispatch({type: "PLAY_CARD", cardIndex: 0})
  await sleep(50)
  
  // close all connections to end the test
  server.close()
  client1.close()
  client2.close()

  // return test results
  return {
    state1: game1.getState(0),
    state2: game2.getState(0)
  }
}
