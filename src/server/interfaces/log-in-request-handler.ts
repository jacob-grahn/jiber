import { Action } from '../../core'
import Account from './account'

interface LogInRequestHandler {
  (action: Action): Promise<Account>|Account
}

export { LogInRequestHandler as default }
