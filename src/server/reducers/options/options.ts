import { OPTIONS_SET } from './options-action-types'
import { simpleSetter, Reducer } from '../../../core'
import LogInRequestHandler from '../../interfaces/log-in-request-handler'
import Storage from '../../interfaces/storage'
import memStorage from '../../storage/mem-storage'
import memAccounts from '../../accounts/mem-accounts'

interface OptionsState {
  webSocketPort: number,
  stunPort: number,
  reducer: Reducer,
  onLogIn: LogInRequestHandler,
  storage: Storage,
  rateLimit: {periodMs: number, max: number},
  maxMessageLength: number
}

const defaultOptions: OptionsState = {
  webSocketPort: 8080,
  stunPort: 3478,
  reducer: simpleSetter,
  onLogIn: memAccounts,
  storage: memStorage,
  rateLimit: {periodMs: 1000, max: 10},                                         // max of 10 messages per second
  maxMessageLength: 2000
}

export default function (state: OptionsState, action: any = {}): OptionsState {
  switch (action.type) {
    case undefined:
      return defaultOptions

    case OPTIONS_SET:
      const customOptions: OptionsState = action.serverOptions
      return {
        ...defaultOptions,
        customOptions
      }
  }
}
