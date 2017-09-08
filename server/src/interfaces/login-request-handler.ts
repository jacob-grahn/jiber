import { Action, User } from '../core'

export type LoginRequestHandler = (action: Action) => Promise<User>
