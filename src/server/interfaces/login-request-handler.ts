import { Action, User } from '../../core/index'

export type LoginRequestHandler = (action: Action) => Promise<User>
