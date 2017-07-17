import Action from '../interfaces/Action'
import { SERVER } from '../constants/source-types'

export default function isConfirmedAction (action: Action): boolean {
  return action.$hope && action.$hope.source === SERVER && action.$hope.actionId
}
