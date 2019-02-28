import JiberClient from 'jiber-client'
import JiberServer from 'jiber-server'

export const runChatApp = (): Promise<{state1: any, state2: any}> => {
  const server = new JiberServer()

  const client1 = new JiberClient()
  const client2 = new JiberClient()

  const chat1 = client1.createDoc('bees')
  const chat2 = client2.createDoc('bees')

  setTimeout(() => {
    chat1.dispatchers.push('messages', 'Hi')
  }, 100)
  setTimeout(() => {
    chat2.dispatchers.push('messages', 'Hello')
  }, 125)
  setTimeout(() => {
    chat1.dispatchers.push('messages', 'I like bees')
  }, 150)
  setTimeout(() => {
    chat2.dispatchers.push('messages', 'Me too')
  }, 175)

  return new Promise((resolve) => {
    setTimeout(() => {
      server.close()
      client1.close()
      client2.close()
      resolve({
        state1: chat1.getState(),
        state2: chat2.getState()
      })
    }, 1000)
  })
}
