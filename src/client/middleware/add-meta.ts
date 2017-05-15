import { Action, CLIENT } from '../../core/index'

export const addMeta = (store: any) => (next: Function) => (action: Action) => {
  if (!action.$hope) {
    return next(action)
  }

  if (!action.$hope.source || action.$hope.source === CLIENT) {
    return next({
      ...action,
      actionId: 0
      roomId: action.$hope.roomId,
      source: CLIENT,
      timeMs: new Date().getTime(),
      userId: roomState.myUserId,
    })
  }
}
