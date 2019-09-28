import HiDBClient from 'hidb-client'
import HiDBServer from 'hidb-server'

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const runChatApp = async (): Promise<{state1: any, state2: any}> => {
  const server = new HiDBServer()

  // push a message before client1 could have made a connection to the server
  // the message should be queued up and sent later when the connection is made
  const client1 = new HiDBClient()
  const chat1 = client1.open('bees')
  chat1.dispatchers.push('messages', 'Hi')

  // client2 should receive the messages from client1, even though they
  // were sent before client2 connected
  await sleep(250)
  const client2 = new HiDBClient()
  const chat2 = client2.open('bees')
  chat2.dispatchers.push('messages', 'Hello')

  // send two normal updates
  await sleep(50)
  chat1.dispatchers.push('messages', 'I like bees')
  await sleep(50)
  chat2.dispatchers.push('messages', 'Me too')

  // messages can still be delivered via wrtc if the server goes down
  await sleep(50)
  server.close()
  chat1.dispatchers.push('messages', 'The server is down')
  await sleep(50)
  chat2.dispatchers.push('messages', 'But wrtc still works')

  // close all connections to end the test
  await sleep(50)
  client1.close()
  client2.close()

  // return test results
  await sleep(50)
  return {
    state1: chat1.getState(0),
    state2: chat2.getState(0)
  }
}
