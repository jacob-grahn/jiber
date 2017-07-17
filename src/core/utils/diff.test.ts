import diff from './diff'

test('unchanged simple values should result in an empty array', () => {
  expect(diff(null, null)).toEqual([])
  expect(diff('hi', 'hi')).toEqual([])
  expect(diff(3, 3)).toEqual([])
  expect(diff(0, 0)).toEqual([])
  expect(diff(undefined, undefined)).toEqual([])
  expect(diff(true, true)).toEqual([])
  expect(diff(false, false)).toEqual([])
})

test('deleted values should return a DEL change', () => {
  expect(diff('hi', undefined)).toEqual([['DEL', '', undefined]])
  expect(diff(null, undefined)).toEqual([['DEL', '', undefined]])
  expect(diff(5, undefined)).toEqual([['DEL', '', undefined]])
  expect(diff(0, undefined)).toEqual([['DEL', '', undefined]])
})

test('same objects should result in an empty array', () => {
  const obj = {yo: 'yo'}
  expect(diff(obj, obj)).toEqual([])
  const arr = [1, 2, 3]
  expect(diff(arr, arr)).toEqual([])
})

test('equivalent objects should result in an empty array', () => {
  expect(diff({yo: 'yo'}, {yo: 'yo'})).toEqual([])
  expect(diff([1, 2, 3], [1, 2, 3])).toEqual([])
})

test('arrays and objects should not be considered the same', () => {
  const arr = ['one', 'two']
  const obj = {'1': 'one', '2': 'two'}
  expect(diff(arr, obj)).toEqual([['SET', '', {1: 'one', 2: 'two'}]])
  expect(diff(obj, arr)).toEqual([['SET', '', ['one', 'two']]])
})

test('changed array elements should result in path updates', () => {
  const arr1 = ['hi', 'john']
  const arr2 = ['hello', 'john', 'piper']
  expect(diff(arr1, arr2)).toEqual([
    ['SET', '0', 'hello'],
    ['SET', '2', 'piper']
  ])
  expect(diff(arr2, arr1)).toEqual([
    ['DEL', '2', undefined],
    ['SET', '0', 'hi']
  ])
})

test('removing multiple from end of array should be in reverse order', () => {
  const arr1 = [0, 1, 2]
  const arr2 = [0]
  expect(diff(arr1, arr2)).toEqual([
    ['DEL', '2', undefined],
    ['DEL', '1', undefined]
  ])
})

test('changed object properties should result in path updates', () => {
  const obj1 = {type: 'table', legs: 4, pattern: 'flowers'}
  const obj2 = {type: 'chair', legs: 4, color: 'blue'}
  expect(diff(obj1, obj2)).toEqual([
    ['SET', 'type', 'chair'],
    ['DEL', 'pattern', undefined],
    ['SET', 'color', 'blue']
  ])
})

test('recursively apply the dif to sub objects and arrays', () => {
  const obj1 = {
    cubicles: [
      {label: 'a1', human: 'Sally Bartt'},
      {label: 'a2', human: {
        name: 'Greg Greggor',
        offences: ['tardiness'],
        awards: ['salesman of the year']
      }}
    ],
    supplies: {
      paper: 12456,
      pens: 115,
      paperclips: 54151651
    }
  }
  const obj2 = {
    cubicles: [
      {label: 'a1', human: 'Sally Bartt'},
      {label: 'a2', human: {
        name: 'Greg Greggor',
        offences: ['tardiness', 'nudity', 'pen theft'],
        pendingExecution: true
      }}
    ],
    supplies: {
      paper: 12456,
      pens: 0,
      paperclips: 54151651
    }
  }
  expect(diff(obj1, obj2)).toEqual([
    ['SET', 'cubicles.1.human.offences.1', 'nudity'],
    ['SET', 'cubicles.1.human.offences.2', 'pen theft'],
    ['DEL', 'cubicles.1.human.awards', undefined],
    ['SET', 'cubicles.1.human.pendingExecution', true],
    ['SET', 'supplies.pens', 0]
  ])
})
