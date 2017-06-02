import { Action } from '../../core/index'
import LogInResult from '../interfaces/log-in-result'

let idCounter = 0

// Dummy account system that gives every login request a new accountId
// This is used if no login function is provided in the initialization options
export default async function memAccounts (
  action: Action
): Promise<LogInResult> {
  idCounter++
  return {
    id: idCounter.toString(),
    data: {}
  }
}
