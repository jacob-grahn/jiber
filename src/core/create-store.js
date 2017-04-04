import memStorage from './mem-storage'
import Store from './store'
import simpleSetter from './reducers/simpleSetter'
import optimistic from './reducers/optimistic'

/**
 * Set up a sync state
 * @param {Object} options extra settings
 * @returns {RealtimeStore} shared data store
 */
export default function createStore (options = {}) {
  const reducer = options.reducer || simpleSetter
  const storage = options.storage || memStorage
  const middleware = options.middleware || []
  const optimisticReducer = optimistic(reducer)
  const store = Store(optimisticReducer, storage, middleware)
  return store
}
