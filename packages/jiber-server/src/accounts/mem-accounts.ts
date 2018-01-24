import { randStr } from '../utils/rand-str'

/**
 * Dummy account system that gives every login request a new accountId
 */
export const memAccounts = async () => {
  return {
    uid: randStr(12)
  }
}
