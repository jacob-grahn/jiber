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
  const client1 = new JiberClient()
  const client2 = new JiberClient()
  const game1 = client1.open('game')
  const game2 = client2.open('game')
  await sleep(50)

  // close all connections to end the test
  await sleep(50)
  server.close()
  client1.close()
  client2.close()

  // return test results
  return {
    state1: game1.getState(0),
    state2: game2.getState(0)
  }
}
