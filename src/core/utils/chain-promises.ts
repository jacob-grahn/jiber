import Middleware from '../interfaces/middleware'

/**
 * Run a series of async (or not) functions one after the other
 * The initial param is passed to the first function
 * Each subsequent function receives the result of the previous function
 */
export default function chainPromises (
  functions: Array<Middleware>,
  param: any
): Promise<any> {
  if (!functions) return Promise.resolve(param)
  return functions.reduce((promise: any, func: Function) => {
    promise.then(func)
  }, Promise.resolve(param))
}
