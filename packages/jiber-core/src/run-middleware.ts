import { Action, Store, Middleware } from './interfaces'

/**
 * Chain a bunch of middleware together
 */
export const runMiddleware = (
  store: Store,
  action: Action,
  funcs: Middleware[]
): Promise<Action> => {
  return new Promise((resolve) => {
    const chain = funcs
      .reverse()
      .map(func => func(store))
      .reduce((next: any, func) => func(next), resolve)
    chain(action)
  })
}
