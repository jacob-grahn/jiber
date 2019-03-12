import { canWrite } from './can-write'

test('return false for root path', () => {
  expect(canWrite([''], {})).toBe(false)
})

test('return true for any non-root path except "protected"', () => {
  expect(canWrite(['hi'])).toBe(true)
  expect(canWrite(['some', 'protected'])).toBe(true)
  expect(canWrite(['protecteder'])).toBe(true)
  expect(canWrite(['protected'])).toBe(false)
  expect(canWrite(['protected', 'another'])).toBe(false)
  expect(canWrite(['protected', 'another', 'value'])).toBe(false)
})

test('return true if user has a matching field', () => {
  expect(canWrite(['protected', 'name', 'sally'], { name: 'sally' })).toBe(true)
  expect(canWrite(['protected', 'name', 'sally'], { name: 'margo' })).toBe(false)
})
