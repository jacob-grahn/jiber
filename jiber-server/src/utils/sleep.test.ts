import { sleep } from './sleep'

// timers are imperfect
// so this checks that the results fall within an acceptable range
test('return a promise that resolves after X milliseconds', async () => {
  const desiredElapsed = 50
  const startTime = new Date().getTime()
  await sleep(desiredElapsed)
  const endTime = new Date().getTime()
  const elapsed = endTime - startTime
  const errorMs = Math.abs(elapsed - desiredElapsed)
  expect(errorMs).toBeLessThan(15)
})
