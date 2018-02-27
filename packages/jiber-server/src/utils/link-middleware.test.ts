import { linkMiddleware } from './link-middleware'

test('create a middleware chain', () => {
  const state: any = {i: 0}
  const count = (state: any) => (next: Function) => (data: any) => {
    state.i += data
    next(data)
  }

  const chain = linkMiddleware(state, [count, count, count])
  chain(5)

  expect(state.i).toBe(15)
})
