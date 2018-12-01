/* export test, expect */

import { Subscription } from './subscription'

test('create an interface', () => {
  const sub = new Subscription()
  expect(sub.publish).toBeTruthy()
  expect(sub.subscribe).toBeTruthy()
})

test('add a subscription', () => {
  const sub = new Subscription()
  let call: any
  sub.subscribe(() => call = 'yay')
  sub.publish()
  expect(call).toBe('yay')
})

test('remove a subscription', () => {
  const sub = new Subscription()
  let calls: any = []
  sub.subscribe(() => calls.push('one'))
  const removeTwo = sub.subscribe(() => calls.push('two'))
  sub.subscribe(() => calls.push('three'))
  removeTwo()
  sub.publish()
  expect(calls).toEqual(['one', 'three'])
})
