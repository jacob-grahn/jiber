import filterRecursive from './filter-recursive'

test('just return simple values', () => {
  expect(filterRecursive(null)).toBe(null)
  expect(filterRecursive(0)).toBe(0)
  expect(filterRecursive(555)).toBe(555)
  expect(filterRecursive('hi there')).toBe('hi there')
})

test('filter objects', () => {
  expect(filterRecursive({})).toEqual({})
  expect(filterRecursive({truthy: 'hi', falsy: ''})).toEqual({truthy: 'hi'})
})

test('filter arrays', () => {
  expect(filterRecursive([])).toEqual([])
  expect(filterRecursive([0,1,0,2])).toEqual([1,2])
})

test('filter into the depths', () => {
  const data = {
    title: 'SuperAnt',
    averageRating: 0,
    readers: [0, '', {name: 'sally', comment: ''}]
  }
  expect(filterRecursive(data)).toEqual({
    title: 'SuperAnt',
    readers: [{name: 'sally'}]
  })
})

test('use custom filter', () => {
  const testFunc = (key: string|number) => {
    if (typeof key === 'number') return true
    return key.charAt(0) !== '_'
  }
  const data = {
    player1: {
      _deck: [4, 5, 6],
      hand: [1, 2, 3]
    }
  }
  expect(filterRecursive(data, testFunc)).toEqual({
    player1: {
      hand: [1, 2, 3]
    }
  })
})
