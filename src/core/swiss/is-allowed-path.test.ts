import { isAllowedPath } from './is-allowed-path'

test('string tests', () => {
  const allowed = ['me.one', 'venus']
  expect(isAllowedPath(allowed, 'me.one')).toBe(true)
  expect(isAllowedPath(allowed, 'me.one.subpath')).toBe(true)
  expect(isAllowedPath(allowed, 'venu.s')).toBe(false)
  expect(isAllowedPath(allowed, 'you')).toBe(false)
  expect(isAllowedPath(allowed, 'me.two')).toBe(false)
  expect(isAllowedPath(allowed, '')).toBe(false)
})

test('regex tests', () => {
  const allowed = [/big/i]
  expect(isAllowedPath(allowed, 'big')).toBe(true)
  expect(isAllowedPath(allowed, 'the.reallyBig.night')).toBe(true)
  expect(isAllowedPath(allowed, 'small')).toBe(false)
  expect(isAllowedPath(allowed, '')).toBe(false)
})

test('defaults to true', () => {
  expect(isAllowedPath(undefined, 'whatever')).toBe(true)
})
