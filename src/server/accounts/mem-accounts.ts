import { Action } from '../../core'
import LogInResult from '../interfaces/log-in-result'

let nextId = 1

/**
 * Dummy account system that gives every login request a new accountId
 * This is used of no login function is provided in the initialization options
 */
export default function memAccounts (action: Action): LogInResult {
  return {
    id: (nextId++).toString(),
    data: {}
  }
}
