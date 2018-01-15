/**
 * This serves as a fake database if one is not provided
 */

import { Action, DB } from 'jiber-core'

export const memoryDB: DB = {
  dispatch: (action: Action) => {
    action.$timeMs = new Date().getTime()
    if (memoryDB.onaction) memoryDB.onaction(action)
    return Promise.resolve()
  },
  close: () => {
    /* do nothing */
  },
  onaction: undefined
}
