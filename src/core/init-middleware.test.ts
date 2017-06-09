import initMiddleware from './init-middleware'
import { Action } from './interfaces/action'
import { Middleware } from './interfaces/middleware'
import { Store } from './create-store'

const store: Store = {dispatch: () => {}, getState: () => 'funstuff'}

test ('middleware is given the store', () => {
  let givenStore
  const middleware: Middleware = (store) => {
    givenStore = store
    return (next) => (action) => next(action)
  }
  const final = () => {}
  initMiddleware([middleware], store, final)
  expect(givenStore).toBe(store)
})

test ('next is either the next middleware, or the final function', () => {
  let next1
  let next2
  let middleware2Internal
  const middleware1: Middleware = () => (next) => {
    next1 = next
    return (action) => next(action)
  }
  const middleware2: Middleware = () => (next) => {
    next2 = next
    middleware2Internal = (action: Action) => next(action)
    return middleware2Internal
  }
  const final = () => {}
  initMiddleware([middleware1, middleware2], store, final)
  expect(next1).toBe(middleware2Internal)
  expect(next2).toBe(final)
})

test ('calling the first middleware chains all the way to final', () => {
  let finalAction
  const addName: Middleware = () => (next) => (action) => {
    next({...action, name: 'sue'})
  }
  const addAge: Middleware = () => (next) => (action) => {
    next({...action, age: 55})
  }
  const final = (action: Action) => finalAction = action
  const chain = initMiddleware([addName, addAge], store, final)
  chain({type: 'test'})
  expect(finalAction).toEqual({type: 'test', name: 'sue', age: 55})
})
