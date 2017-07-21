import Action from '../interfaces/Action'
import { SERVER } from '../constants/source-types'

export default function isConfirmedAction (action: Action): boolean {
  if (!action.$hope) return false
  return !!(action.$hope.source === SERVER && action.$hope.actionId)
}
