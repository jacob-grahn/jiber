import { filter } from './filter'

test('only pass actions with a certain value through', () => {
  const reducer = (state: any) => state + 1
  const action = {type: 'jump'}
  const state = 0
  const newState = filter(reducer, 'type', 'jump')(state, action)
  expect(newState).toBe(1)
})

test('do not pass through other actions', () => {
  const reducer = (state: any) => state + 1
  const action = {type: 'sit'}
  const state = 0
  const newState = filter(reducer, 'type', 'jump')(state, action)
  expect(newState).toBe(0)
})
