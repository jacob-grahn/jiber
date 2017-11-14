const speed = 0.3 // pixels per millisecond

// Our app logic
const player = (state, action) => {
  if (!state) {
    state = {
      posX: 250,
      posY: 250,
      color: 'green'
    }
  }
  switch (action.type) {
    case 'jiber/LEAVE_ROOM':
      return undefined
    case 'COLOR':
      return {...state, color: action.color}
    case 'WALK_TO':
      return {...state, targetX: action.x, targetY: action.y}
    default:
      return state
  }
}

const players = (state, action) => {
  if (!action.$u) return state
  const playerState = state[action.$u]
  const newPlayerState = player(playerState, action)
  if (newPlayerState) {
    return {...state, [action.$u]: newPlayerState}
  } else {
    state = {...state}
    delete state[action.$u]
    return state
  }
}

const physics = (state, timeMs) => {
  const elapsed = timeMs - state.timeMs
  state.timeMs = timeMs

  Object.keys(state.players).forEach(playerId => {
    const player = state.players[playerId]

    if (player.targetX === undefined) return

    const distX = player.targetX - player.posX
    const distY = player.targetY - player.posY
    const dist = Math.sqrt((distX * distX) + (distY * distY))
    const angle = Math.atan2(distY, distX)
    const moveX = Math.cos(angle) * speed * elapsed
    const moveY = Math.sin(angle) * speed * elapsed
    const move = speed * elapsed

    if (move > dist) {
      player.posX = player.targetX
      player.posY = player.targetY
      player.targetX = undefined
      player.targetY = undefined
    } else {
      player.posX += moveX
      player.posY += moveY
    }
  })

  return state
}

const reducer = (pastState, action) => {
  if (!pastState) {
    pastState = {
      timeMs: new Date().getTime(),
      players: {}
    }
  }

  const currentState = physics(pastState, action.$t)

  return {
    ...currentState,
    players: players(currentState.players, action)
  }
}

module.exports = reducer
