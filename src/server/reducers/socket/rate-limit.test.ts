import rateLimit from './rate-limit'
import { socketReceive, rateLimitOptions } from './socket'

test('default to sane values', () => {
  const state = undefined
  const action = {type: 'blah'}
  expect(rateLimit(state, action)).toEqual({
    periodDuration: 1000,
    period: 0,
    total: 0
  })
})

test('increment total on receive', () => {
  const state = undefined
  const action = socketReceive('1')
  expect(rateLimit(state, action)).toEqual({
    periodDuration: 1000,
    period: Math.floor(action.timeMs / 1000),
    total: 1
  })
})

test('reset total when a new period starts', () => {
  const state = {
    periodDuration: 1000,
    period: 50,
    total: 200
  }
  const action = socketReceive('1')
  expect(rateLimit(state, action)).toEqual({
    periodDuration: 1000,
    period: Math.floor(action.timeMs / 1000),
    total: 1
  })
})

test('set custom rate limit values', () => {
  const state = undefined
  const action = rateLimitOptions('1', 5000)
  expect(rateLimit(state, action)).toEqual({
    periodDuration: 5000,
    period: 0,
    total: 0
  })
})
