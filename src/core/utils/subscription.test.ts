import { createSubscription } from './subscription'

test('create an interface', () => {
  const sub = createSubscription()
  expect(sub.publish).toBeTruthy()
  expect(sub.subscribe).toBeTruthy()
})

test('add a subscription', () => {
  const sub = createSubscription()
  let call: any
  sub.subscribe(() => call = 'yay')
  sub.publish()
  expect(call).toBe('yay')
})

test('remove a subscription', () => {
  const sub = createSubscription()
  let calls: any = []
  sub.subscribe(() => calls.push('one'))
  const removeTwo = sub.subscribe(() => calls.push('two'))
  sub.subscribe(() => calls.push('three'))
  removeTwo()
  sub.publish()
  expect(calls).toEqual(['one', 'three'])
})
