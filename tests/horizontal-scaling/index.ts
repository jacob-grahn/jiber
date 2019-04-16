import JiberClient from 'jiber-client'
import JiberServer from 'jiber-server'
import { jiberRedis, closeAllConnections } from 'jiber-redis'

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const runHorizontalApp = async (): Promise<any> => {

  // run multiple servers for horizontal scaling and high availability
  const redis1 = jiberRedis({})
  const redis2 = jiberRedis({})
  const server1 = new JiberServer({ port: 5555, middleware: [redis1] })
  const server2 = new JiberServer({ port: 7777, middleware: [redis2] })
  const client1 = new JiberClient({ url: 'ws://localhost:5555' })
  const client2 = new JiberClient({ url: 'ws://localhost:7777' })
  const doc1 = client1.open('so-ha')
  const doc2 = client2.open('so-ha')
  doc1.dispatchers.set('doc1', 'was here')
  doc2.dispatchers.set('doc2', 'knows all')
  await sleep(500)

  // shut down the servers to make sure wrtc wtill works
  server1.close()
  server2.close()
  doc1.dispatchers.push('messages', 'The server is down')
  await sleep(100)
  doc2.dispatchers.push('messages', 'But wrtc still works')
  await sleep(100)

  // close all connections to end the test
  client1.close()
  client2.close()
  closeAllConnections()

  // return test results
  return {
    confirmedState1: doc1.getState(2),
    confirmedState2: doc2.getState(2),
    optimisticState1: doc1.getState(0),
    optimisticState2: doc2.getState(0)
  }
}
