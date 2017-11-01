import { withField } from './with-field'

test('return values with a matching userId property', () => {
  const actions = [
    null,
    undefined,
    false,
    {},
    { userId: 'abc' },
    { userId: 'def' }
  ]

  expect(withField(actions, 'userId', 'abc')).toEqual([{ userId: 'abc' }])
})
