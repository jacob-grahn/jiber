import memStorage from './mem-storage'
import Store from './store'
import emit from './middleware/emit'
import injectMetadata from './middleware/injectMetadata'
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
  const middleware = options.middleware ? options.middleware : []
  const optimisticReducer = optimistic(reducer)
  const realtimeMiddleware = [...middleware, injectMetadata, emit]
  const store = Store(optimisticReducer, storage, realtimeMiddleware)
  return store
}
