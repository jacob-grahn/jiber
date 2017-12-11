import { User } from 'jiber-core'

export type LoginRequestHandler = (req: any, credential: string) => Promise<User>
