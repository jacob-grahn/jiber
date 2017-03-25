import memStorage from './mem-storage'
import Store from './store'
import emit from './middleware/emit'
import injectMetadata from './middleware/injectMetadata'

/**
 * Set up a sync state
 * @param {Function} reducer - a function that changes the state
 * @param {Object} options - extra settings
 */
export default function init (reducer, options = {}) {
  const storage = options.storage || memStorage()
  const middleware = options.middleware ? [...options.middleware] : []
  middleware.push(injectMetadata)
  middleware.push(emit)
  const store = Store(reducer, storage, {middleware})
  return store
}
