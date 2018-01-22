import { withField } from './with-field'

test('return values with a matching uid property', () => {
  const actions = [
    null,
    undefined,
    false,
    {},
    { uid: 'abc' },
    { uid: 'def' }
  ]

  expect(withField(actions, 'uid', 'abc')).toEqual([{ uid: 'abc' }])
})
