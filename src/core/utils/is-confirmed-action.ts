import { Action, SERVER } from '../../core/index'

export default function isConfirmedAction (action: Action): boolean {
  return action.$hope && action.$hope.source === SERVER && action.$hope.actionId
}
