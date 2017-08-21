import Action from '../interfaces/action'

export const lastUpdatedAt = (
  state: number = 0,
  action: Action
): number => {
  return action.$timeMs || state
}
