import { randStr } from './utils/rand-str'

/**
 * Dummy account system that gives every login request a new accountId
 */
export const verifyClient = async (info: {req: any}, cb: Function) => {
  try {
    const result = { userId: randStr(12) }
    info.req.verified = result
    cb(true)
  } catch (e) {
    cb(false)
  }
}
