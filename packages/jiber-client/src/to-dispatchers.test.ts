import { toDispatchers } from './to-dispatchers'

test('turn action creators into action dispatchers', () => {
  const calls: any[] = []
  const dispatch = (action: any) => calls.push(action)
  const creators = {
    inc: (path: string, num: number) => ({ type: 'INC', path, num })
  }
  const dispatchers = toDispatchers(dispatch, creators)
  dispatchers.inc('total', 5)
  expect(calls[0]).toEqual({ type: 'INC', path: 'total', num: 5 })
})
