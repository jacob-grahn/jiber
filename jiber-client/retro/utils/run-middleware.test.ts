import { runMiddleware } from './run-middleware'
import { Action, Store } from '../interfaces'

test('middleware is called', (done) => {
  const store: any = {
    getState: () => 5
  }
  const func = (store: Store) => (next: Function) => (action: Action) => {
    action.value += store.getState()
    next(action)
  }
  const action: Action = { type: 'test', value: 1 }
  runMiddleware(store, action, [func, func], (finalAction: Action) => {
    expect(finalAction.value).toBe(11)
    done()
  })
})
