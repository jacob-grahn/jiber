import { sleep } from './sleep'
jest.useFakeTimers()

test('return a promise that resolves after X milliseconds', () => {
  const desiredElapsed = 50
  const startTime = new Date().getTime()
  const promise = sleep(desiredElapsed)
  promise.then(() => {
    const endTime = new Date().getTime()
    const elapsed = endTime - startTime
    const errorMs = Math.abs(elapsed - desiredElapsed)
    console.log(startTime, endTime)
    expect(errorMs).toBeLessThan(15)
  }).catch(() => {
    throw new Error('Something is bad broke')
  })

  jest.runTimersToTime(desiredElapsed)
  return promise
})
