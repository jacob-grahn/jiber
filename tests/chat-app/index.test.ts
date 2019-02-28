import { runChatApp } from './index'

test('chat history', async () => {
  const state = await runChatApp()
  const expectedState = ['Hi', 'Hello', 'I like bees', 'Me too']
  expect(state.state1.messages).toEqual(expectedState)
  expect(state.state2.messages).toEqual(expectedState)
})
