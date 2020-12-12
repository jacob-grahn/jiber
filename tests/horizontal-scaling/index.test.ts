import { runHorizontalApp } from './index'

test('horizontal scaling', async () => {
  const { confirmedState1, confirmedState2, optimisticState1, optimisticState2 } = await runHorizontalApp()
  const expectedConfirmedState = {
    doc1: 'was here',
    doc2: 'knows all'
  }
  const expectedOptimisticState = {
    doc1: 'was here',
    doc2: 'knows all',
    messages: ['The server is down', 'But wrtc still works']
  }
  expect(confirmedState1).toEqual(expectedConfirmedState)
  expect(confirmedState2).toEqual(expectedConfirmedState)
  expect(optimisticState1).toEqual(expectedOptimisticState)
  expect(optimisticState2).toEqual(expectedOptimisticState)
})
