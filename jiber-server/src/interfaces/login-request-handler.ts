import { Action, User } from 'jiber-core'

export type LoginRequestHandler = (action: Action) => Promise<User>
