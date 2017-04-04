/**
 * Run async middleware before commiting actions to a reducer
 * @param {Function} reducer      the reducer to commit actions to
 * @param {Object} storage        obj with a getState and setState function
 * @param {Function[]} middleware steps to execute before commiting an action
 */
export default function Store (reducer, storage, middleware = []) {
  function dispatch (action) {
    return asyncSerial(middleware, action).then(commit)
  }

  function commit (action) {
    const oldState = storage.getState()
    const newState = reducer(oldState, action)
    storage.setState(newState)
  }

  return {
    dispatch
  }
}

/**
 * Run a series of async (or not) functions one after the other
 * The initial param is passed to the first function
 * Each subsequent function receives the result of the previous function
 * @param {Function[]} functions  a list of possibly async functions
 * @param {*} param               a value to pass to the first function
 * @returns {Promise}             the value that the last function resolves
 */
function asyncSerial (functions, param) {
  if (!functions) return Promise.resolve(param)
  return functions.reduce((promise, func) => {
    promise.then(func)
  }, Promise.resolve(param))
}
