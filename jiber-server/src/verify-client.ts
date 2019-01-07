import { v4 as uuidv4 } from 'uuid'

/**
 * Dummy account system that gives every login request a new accountId
 */
export const verifyClient = async (info: {req: any}, cb: Function) => {
  try {
    info.req.verified = { userId: uuidv4() }
    cb(true)
  } catch (e) {
    cb(false)
  }
}
