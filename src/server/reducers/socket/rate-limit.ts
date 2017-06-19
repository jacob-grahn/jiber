import { Action } from '../../../core/index'
import { RATE_LIMIT_OPTIONS, RECEIVE } from './socket'

export interface RateLimitState {
  periodDuration: number,
  period: number,
  max: number,
  total: number
}

export default function rateLimit (
  state: RateLimitState = {periodDuration: 1000, period: 0, max: 10, total: 0},
  action: Action
): RateLimitState {
  switch (action.type) {
    case RATE_LIMIT_OPTIONS:
      return {
        ...state,
        periodDuration: action.periodDuration,
        max: action.max
      }

    case RECEIVE:
      const period = Math.floor(action.timeMs / state.periodDuration)
      const isSamePeriod = (period === state.period)
      const total = isSamePeriod ? (state.total + 1) : 1
      return {
        ...state,
        period,
        total
      }

    default:
      return state
  }
}
