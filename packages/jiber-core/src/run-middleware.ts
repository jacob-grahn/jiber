import { Action, Store, Middleware } from './interfaces'

/**
 * Chain a bunch of middleware together
 */
export const runMiddleware = (
  store: Store,
  action: Action,
  funcs: Middleware[],
  cb: Function
): void => {
  const chain = funcs
    .reverse()
    .map(func => func(store))
    .reduce((next: any, func) => func(next), cb)
  chain(action)
}
