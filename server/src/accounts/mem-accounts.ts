import { User } from '../core'
import { randStr } from '../utils/rand-str'

/**
 * Dummy account system that gives every login request a new accountId
 * todo: split out these other functions
 */
export const memAccounts = async (): Promise<User> => {
  return {
    userId: randStr(12),
    grantRead: [''],
    grantWrite: ['']
  }
}
