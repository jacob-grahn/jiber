import * as ws from 'ws'
import {
  INC_MESSAGE_COUNT
} from './user-action-types'

interface IUserState {
  connectionId: number,
  messageCount: number
}

export default function (state: IUserState, action: any = {}): IUserState {
  switch (action.type) {
    case undefined:
      return {
        connectionId: null,
        messageCount: 0
      }

    case INC_MESSAGE_COUNT:
      return {
        ...state,
        messageCount: state.messageCount + 1
      }
  }
}
