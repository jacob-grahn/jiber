import { randStr } from './rand-str'

test('correct length', () => {
  expect(randStr(0)).toBe('')
  expect(randStr(1).length).toBe(1)
  expect(randStr(4).length).toBe(4)
  expect(randStr(103).length).toBe(103)
})

test('random-ish', () => {
  const rand1 = randStr(8)
  const rand2 = randStr(8)
  expect(rand1).not.toBe(rand2)
})
