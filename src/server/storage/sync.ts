import ServerState from '../interfaces/server-state'

export default function createSync (
  getState: () => ServerState
) {
  return function sync () {
    const state = getState()
    const roomIds = Object.keys(state.rooms)
    roomIds.forEach(roomId => {
      const room = state.rooms[roomId]
      if (room.lastUpdatedAt < 1000)
    })
  }
}
