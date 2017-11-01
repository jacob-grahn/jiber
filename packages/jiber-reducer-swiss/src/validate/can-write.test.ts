import { canWrite } from './can-write'

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('default to false', () => {
  expect(canWrite({}, 'some.path')).toBe(false)
})

test('root level .write', () => {
  expect(canWrite({'.write': true}, 'some.path')).toBe(true)
  expect(canWrite({'.write': false}, 'some.path')).toBe(false)
})

test('path with an array', () => {
  const rules = {
    bags: [{
      width: {'.type': 'number', '.write': false},
      height: {'.type': 'number', '.write': true}
    }]
  }
  expect(canWrite(rules, 'bags.0.height')).toBe(true)
  expect(canWrite(rules, 'bags.5.height')).toBe(true)
  expect(canWrite(rules, 'bags.5.width')).toBe(false)
})
