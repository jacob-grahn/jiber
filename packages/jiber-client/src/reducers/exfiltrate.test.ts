import { exfiltrate } from './exfiltrate'

test('smuggle state into the action', () => {
  const reducer = () => 'money'
  const state = undefined
  const action = {type: 'what'}
  const newState = exfiltrate(reducer, '$$secretBox')(state, action)
  expect(newState).toBe('money')
  expect(action).toEqual({type: 'what', $$secretBox: 'money'})
})
