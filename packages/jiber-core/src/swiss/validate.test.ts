import { validate } from './validate'

test('base element', () => {
  const rules = {
    '.type': 'string'
  }
  expect(validate(rules, '', 'hello')).toBe(true)
  expect(validate(rules, '', 55)).toBe(false)
})

test('deep tests', () => {
  const rules = {
    bags: [{
      width: {'.type': 'number'},
      height: {'.type': 'any'}
    }]
  }
  expect(validate(rules, 'bags.7.width', 100)).toBe(true)
  expect(validate(rules, 'bags.7.height', 100)).toBe(true)
  expect(validate(rules, 'bags.7.width', 'abc')).toBe(false)
})

test('check arrays', () => {
  const rules = {
    bags: []
  }
  expect(validate(rules, 'bags', [])).toBe(true)
  expect(validate(rules, 'bags', {})).toBe(false)
})

test('check ojects', () => {
  const rules = {
    bag: {
      label: {'.type': 'string'}
    }
  }
  expect(validate(rules, 'bag', {})).toBe(true)
  expect(validate(rules, 'bag', 'not an object')).toBe(false)
  expect(validate(rules, 'bag', [])).toBe(false)
})

test('do not set undefined properties on objects', () => {
  const rules = {
    bag: {}
  }
  expect(validate(rules, 'bag.name', 'baggy')).toBe(false)
})

test('set undefined properties on any', () => {
  const rules = {
    bag: {
      '*': {'.type': 'string'}
    }
  }
  expect(validate(rules, 'bag.name', 'baggy')).toBe(true)
})
