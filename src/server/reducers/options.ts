import { Action, simpleSetter } from '../../core/index'
import LogInRequestHandler from '../interfaces/log-in-request-handler'
import Storage from '../interfaces/storage'
import memStorage from '../storage/mem-storage'
import memAccounts from '../accounts/mem-accounts'

// Setup
interface OptionsState {
  webSocketPort: number,
  stunPort: number,
  onLogIn: LogInRequestHandler,
  storage: Storage,
  rateLimit: {periodMs: number, max: number},
  maxMessageLength: number
}

const defaultOptions: OptionsState = {
  webSocketPort: 80,
  stunPort: 3478,
  onLogIn: memAccounts,
  storage: memStorage,
  rateLimit: {periodMs: 1000, max: 10},                                         // max of 10 messages per second
  maxMessageLength: 2000
}

// Actions
const OPTIONS_SET = 'hope/options/OPTIONS_SET'

// Reducer
export default function options (
  state: OptionsState|undefined,
  action: Action
): OptionsState {
  switch (action.type) {
    case OPTIONS_SET:
      return {
        ...defaultOptions,
        ...action.options
      }

    default:
      return state || defaultOptions
  }
}

// Action Creators
export function setOptions (options: any) {
  return {type: OPTIONS_SET, options}
}
