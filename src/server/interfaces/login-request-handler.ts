import { Action } from '../../core/index'
import { LoginResult } from './login-result'

export interface LoginRequestHandler {
  (action: Action): Promise<LoginResult>|LoginResult
}
