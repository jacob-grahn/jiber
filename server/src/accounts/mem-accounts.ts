import { User } from '../core'

const randChar = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const index = Math.floor(Math.random() * (chars.length - 1))
  return chars.charAt(index)
}

const randStr = (len: number) => {
  let str = ''
  for (let i = len; i > 0; i--) {
    str += randChar()
  }
  return str
}

/**
 * Dummy account system that gives every login request a new accountId
 * todo: split out these other functions
 */
export const memAccounts = async (): Promise<User> => {
  return {
    userId: randStr(12),
    grantRead: [''],
    grantWrite: ['']
  }
}
