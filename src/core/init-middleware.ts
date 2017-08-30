import { Middleware } from './interfaces/middleware'
import { Action } from './interfaces/action'
import { Store } from './store'
import { Next } from './interfaces/next'

export const initMiddleware = (
  middlewares: Middleware[],
  store: Store,
  final: (action: Action) => void
): Next => {
  const withStore = middlewares.map(mid => mid(store))                          // give each middleware the store
  const reversed = withStore.reverse()
  return reversed.reduce(                                                       // set up each middleware to call the next
    (next, mid) => mid(next),
    final                                                                       // the final middleware calls final(action)
  )
}
