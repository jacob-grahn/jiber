import { createScheduler } from './scheduler'
// import { sleep } from '../utils/sleep'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let callCount: number
const aFunc = () => callCount++
beforeEach(() => callCount = 0)
jest.useFakeTimers()

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('start should call the function immediately', () => {
  const scheduler = createScheduler(aFunc, 1000)
  scheduler.start()
  scheduler.stop()
  expect(callCount).toBe(1)
})

test('should keep running the function until stop is called', () => {
  const scheduler = createScheduler(aFunc, 10)
  scheduler.start()

  jest.runTimersToTime(50)
  expect(callCount).toBe(6)

  scheduler.stop()

  jest.runTimersToTime(100)
  expect(callCount).toBe(6)
})
