import { Action } from '../../core/index'
import LoginResult from './login-result'

interface LoginRequestHandler {
  (action: Action): Promise<LoginResult>|LoginResult
}

export { LoginRequestHandler as default }
