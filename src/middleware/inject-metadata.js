import randomStr from '../utils/random-str'
import { LOCAL } from '../source-types'

/**
 * Add some helpful data to the action
 * @param {Object} - an action object
 * @returns {Object} - an action object with helpful data
 */
export default function injectMetadata (action) {
  const source = action.realtimeSource || LOCAL                                 // actions without a source are assumed to be local
  if (source !== LOCAL) return action                                           // only add metadata to local actions
  return {
    ...action,
    realtimeSource: LOCAL,                                                      // mark that this action originated locally
    realtimeId: randomStr(16)                                                   // generate a unique id
  }
}
