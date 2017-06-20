import { Action } from '../../core/index'

export interface RoomActionDict {
  [key: string]: Action[]
}

export default function createOnActions (
  addActions: (roomId: string, actions: Action[]) => Promise<void>,
  updateRoom: (roomId: string) => any
) {
  return async function onActions (
    userId: string,
    actions: Action[]
  ): Promise<void> {
    const userActions: Action[] = actions.map((action: Action) => {
      const roomId = action.$hope.roomId || action.$hope
      return {...action, $hope: {userId, roomId}}
    })

    const roomDict: RoomActionDict = userActions.reduce(                        // split the actions up into rooms
      (dict: RoomActionDict, action: Action): RoomActionDict => {
        const roomId = action.$hope.roomId
        if (!dict[roomId]) {
          dict[roomId] = []
        }
        dict[roomId].push(action)
        return dict
      },
      {}
    )
    const roomIds = Object.keys(roomDict)

    await Promise.all(roomIds.map((roomId: string) => {                         // add the actions to room queues
      const actions: Action[] = roomDict[roomId]
      return addActions(roomId, actions)
    }))

    roomIds.forEach(updateRoom)                                                 // trigger instant room updates for faster results
  }
}
