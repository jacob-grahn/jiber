const speed = 0.3 // pixels per millisecond

// Our app logic
const reducer = (state, action) => {
  if (!state) {
    state = {
      timeMs: action.$timeMs,
      players: {}
    }
  }

  physics(state, action.$timeMs)
  input(state, action)

  return state
}

const input = (state, action) => {
  const uid = action.$uid
  if (!uid) return

  let player = state.players[uid]
  if (!player) {
    player = {
      posX: 250,
      posY: 250,
      color: 0
    }
    state.players[uid] = player
  }

  switch (action.type) {
    case 'jiber/CLOSE':
      delete state.players[uid]
      break
    case 'COLOR':
      player.color = action.color
      break
    case 'WALK_TO':
      player.targetX = action.x
      player.targetY = action.y
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
}

module.exports = reducer
