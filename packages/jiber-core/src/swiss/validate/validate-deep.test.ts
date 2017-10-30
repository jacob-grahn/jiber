import { validateDeep } from './validate-deep'

const state = 'teststate'
const me = 'testme'
const oldValue = 'testoldvalue'

test('strings and numbers should validate normally', () => {
  const rules = {name: {'.type': 'string'}}
  const path = 'name'
  expect(validateDeep({oldValue, me, state, rules, path, newValue: 'bob'}))
    .toBe(true)
  expect(validateDeep({oldValue, me, state, rules, path, newValue: 5}))
    .toBe(false)
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
  const path = 'people.7.name'
  const goodName = {first: 'Billy', last: 'Bob'}
  const badName = {firest: 'Billy', middle: 'Bob', last: 'Thorton'}
  expect(validateDeep({state, me, oldValue, rules, path, newValue: goodName}))
    .toBe(true)
  expect(validateDeep({state, me, oldValue, rules, path, newValue: badName}))
    .toBe(false)
})
