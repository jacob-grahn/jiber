import randomStr from '../random-str'
import { LOCAL } from '../source-types'

/**
 * Add some helpful data to the action
 * @param {Object} - an action object
 * @returns {Object} - an action object with helpful data
 */
export default function injectMetadata (action) {
  const source = action.$source || LOCAL                                        // actions without a source are assumed to be local
  if (source !== LOCAL) return action                                           // only add metadata to local actions
  return {
    ...action,
    $source: LOCAL,
    $timeMs: new Date().time(),
    $id: randomStr(16)
  }
}
