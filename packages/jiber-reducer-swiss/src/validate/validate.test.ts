import { validate } from './validate'

test('base element', () => {
  const rules = { '.type': 'string' }
  expect(validate({ rules, path: '', newValue: 'hello' } as any)).toBe(true)
  expect(validate({ rules, path: '', newValue: 55 } as any)).toBe(false)
})

test('deep tests', () => {
  const rules = {
    bags: [{
      width: { '.type': 'number' },
      height: { '.type': 'any' }
    }]
  }
  expect(validate({ rules, path: 'bags.7.width', newValue: 100 } as any))
    .toBe(true)
  expect(validate({ rules, path: 'bags.7.height', newValue: 100 } as any))
    .toBe(true)
  expect(validate({ rules, path: 'bags.7.width', newValue: 'abc' } as any))
    .toBe(false)
})

test('check arrays', () => {
  const rules = {
    bags: []
  }
  expect(validate({ rules, path: 'bags', newValue: [] } as any)).toBe(true)
  expect(validate({ rules, path: 'bags', newValue: {} } as any)).toBe(false)
})

test('check ojects', () => {
  const rules = {
    bag: {
      label: { '.type': 'string' }
    }
  }
  expect(validate({ rules, path: 'bag', newValue: {} } as any)).toBe(true)
  expect(validate({ rules, path: 'bag', newValue: 'la' } as any)).toBe(false)
  expect(validate({ rules, path: 'bag', newValue: [] } as any)).toBe(false)
})

test('do not set undefined properties on objects', () => {
  const rules = {
    bag: {}
  }
  expect(validate({ rules, path: 'bag.name', newValue: 'baggy' } as any))
    .toBe(false)
})

test('wildcard rules', () => {
  const rules = {
    bag: {
      '*': { '.type': 'string' }
    }
  }
  expect(validate({ rules, path: 'bag.name', newValue: 'baggy' } as any))
    .toBe(true)
})
