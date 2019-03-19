import { interpolate } from './interpolate'

test('interpolate a thing!', () => {
  const ctx = { values: ['a', 'b', 'c'] }
  expect(interpolate(ctx, '-${ values[1] }-')).toBe('-b-')
})

test('interpolate multiple things!', () => {
  const ctx = { values: ['a', 'b', 'c'] }
  expect(interpolate(ctx, '${values[1]}${values[0]}')).toBe('ba')
})
