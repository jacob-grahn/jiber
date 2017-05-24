import { Action } from '../../../core/index'
import LogInResult from './log-in-result'

interface LogInRequestHandler {
  (action: Action): Promise<LogInResult>|LogInResult
}

export { LogInRequestHandler as default }
