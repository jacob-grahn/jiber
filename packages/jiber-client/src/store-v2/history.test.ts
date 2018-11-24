import { History } from './history'
import { Action } from './action'

test('add action to end', () => {
  const h = new History()
  h.add(new Action({ id: '1', time: 1 }))
  h.add(new Action({ id: '2', time: 2 }))
  const actions = h.from(2)
  expect(actions.length).toBe(1)
  expect(actions[0].time).toEqual(2)
})

test('replace existing action with a lower trust', () => {
  const h = new History()
  h.add(new Action({ id: '1', trust: 1, payload: 'hi' }))
  h.add(new Action({ id: '1', trust: 2, payload: 'bye' }))
  const actions = h.from(0)
  expect(actions.length).toBe(1)
  expect(actions[0].payload).toEqual('bye')
})

test('dont replace existing action with a lower or equal trust', () => {
  const h = new History()
  h.add(new Action({ id: '1', trust: 1, payload: 'hi' }))
  h.add(new Action({ id: '1', trust: 1, payload: 'bye' }))
  const actions = h.from(0)
  expect(actions.length).toBe(1)
  expect(actions[0].payload).toBe('hi')
})
