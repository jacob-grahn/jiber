import { sleep } from './sleep'
jest.useFakeTimers()

test('return a promise that resolves after X milliseconds', () => {
  const desiredElapsed = 1
  const startTime = new Date().getTime()
  const promise = sleep(desiredElapsed)
  promise.then(() => {
    const endTime = new Date().getTime()
    const elapsed = endTime - startTime
    const errorMs = Math.abs(elapsed - desiredElapsed)
    expect(errorMs).toBeLessThan(1000)
  }).catch((e) => {
    throw new Error(e)
  })

  jest.runTimersToTime(desiredElapsed)
  return promise
})
