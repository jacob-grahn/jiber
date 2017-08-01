import Action from '../interfaces/action'

export default function lastUpdatedAt (
  state: number = 0,
  action: Action
): number {
  return action.$timeMs || state
}
