import { flatten } from './flatten'

test('do nothing to a simple object', () => {
  const obj = {
    name: 'jazz'
  }
  expect(flatten(obj)).toEqual({
    name: 'jazz'
  })
})

test('flatten a deep object', () => {
  const obj = {
    name: {
      first: 'Jazz',
      last: 'McJazzers'
    }
  }
  expect(flatten(obj)).toEqual({
    'name.first': 'Jazz',
    'name.last': 'McJazzers'
  })
})

test('flatten arrays, too', () => {
  const obj = [{
    name: [{
      first: 'Jazz',
      last: 'McJazzers'
    }]
  }]
  expect(flatten(obj)).toEqual({
    '0.name.0.first': 'Jazz',
    '0.name.0.last': 'McJazzers'
  })
})
