import { createScheduler } from './scheduler'
import { sleep } from '../utils/sleep'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let callCount: number
const aFunc = () => callCount++
beforeEach(() => callCount = 0)

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('start should call the function immediately', () => {
  const scheduler = createScheduler(aFunc, 1000)
  scheduler.start()
  scheduler.stop()
  expect(callCount).toBe(1)
})

test('should keep running the function until stop is called', async () => {
  const scheduler = createScheduler(aFunc, 10)
  scheduler.start()

  await sleep(100)
  expect(callCount).toBeGreaterThan(3)
  expect(callCount).toBeLessThan(15)
  const savedCallCount = callCount
  scheduler.stop()

  await sleep(100)
  expect(callCount).toBe(savedCallCount)
})
