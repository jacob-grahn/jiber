import del from './del'

test('deep paths work', () => {
  const user = {name: {first: 'sue'}}
  expect(del(user, 'name.first')).toEqual({name: {}})
})

test('non existant paths are ignored safely', () => {
  expect(del({}, 'name.first.wee')).toEqual({})
})

test('arrays should work', () => {
  const users = [{name: 'bob'}, {name: 'sue'}]
  expect(del(users, '0.name')).toEqual([{}, {name: 'sue'}])
})

test('an empty path should delete the initial value', () => {
  expect(del('abc', '')).toEqual(undefined)
})
