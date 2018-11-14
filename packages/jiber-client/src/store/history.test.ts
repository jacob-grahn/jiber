import { History } from './history'

test('add action to end', () => {
  const h = new History()
  h.save({ time: 1 })
  h.save({ time: 2 })
  expect(h.from(2)).toEqual([{ time: 2 }])
})

test('replace existing action with a lower trust', () => {
  const h = new History()
  h.save({ id: 1, time: 1, trust: 1 })
  h.save({ id: 1, time: 2, trust: 2 })
  expect(h.from(0)).toEqual([{ id: 1, time: 2, trust: 2 }])
})

test('dont replace existing action with a lower trust', () => {
  const h = new History()
  h.save({ id: 1, time: 1, trust: 1 })
  h.save({ id: 1, time: 2, trust: 1 })
  expect(h.from(0)).toEqual([{ id: 1, time: 1, trust: 1 }])
})
