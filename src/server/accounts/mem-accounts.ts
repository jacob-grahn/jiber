import { Action } from '../../core'
import Account from '../interfaces/account'

let nextId = 1

export default function memAccounts (action: Action): Account {
  return {
    id: (nextId++).toString(),
    account: {}
  }
}
