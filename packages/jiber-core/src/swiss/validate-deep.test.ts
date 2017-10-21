import { validateDeep } from './validate-deep'

test('strings and numbers should validate normally', () => {
  const rules = {
    name: {'.type': 'string'}
  }
  expect(validateDeep(rules, 'name', 'bob')).toBe(true)
  expect(validateDeep(rules, 'name', 5)).toBe(false)
})

test('objects and all of their child data is checked', () => {
  const rules = {
    people: [{
      name: {
        first: {'.type': 'string'},
        last: {'.type': 'string'}
      }
    }]
  }
  const goodName = {first: 'Billy', last: 'Bob'}
  const badName = {firest: 'Billy', middle: 'Bob', last: 'Thorton'}
  expect(validateDeep(rules, 'people.7.name', goodName)).toBe(true)
  expect(validateDeep(rules, 'people.7.name', badName)).toBe(false)
})
