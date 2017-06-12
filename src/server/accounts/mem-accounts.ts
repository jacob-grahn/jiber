import LoginResult from '../interfaces/login-result'

let idCounter = 0

// Dummy account system that gives every login request a new accountId
// This is used if no login function is provided in the initialization options
export default async function memAccounts (): Promise<LoginResult> {
  idCounter++
  return {
    id: idCounter.toString(),
    data: {}
  }
}
