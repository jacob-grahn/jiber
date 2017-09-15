import { User } from 'jiber-core'
import { randStr } from '../utils/rand-str'

/**
 * Dummy account system that gives every login request a new accountId
 */
export const memAccounts = async (): Promise<User> => {
  return {
    userId: randStr(12),
    grantRead: [''],
    grantWrite: ['']
  }
}
