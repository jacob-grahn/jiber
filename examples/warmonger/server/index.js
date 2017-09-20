const jiber = require('jiber-server')
const map = jiber.map

const middleware = [
  store => action => next => {
    switch (action.type) {
      case 'DRAW_FROM_DECK':
        const roomId = action.$roomId
        const userId = action.$userId
        const state = store.getState()
        const room = state.rooms[roomId]
        const deck = room.deck
        if (deck.length === 0) return
        action.cards = [deck.pop(), deck.pop()]
        action.$sendToUsers = [userId]
        return next(action)

      default:
        return next(action)
    }
  }
]

const isTurnComplete = (room) => {
  return Object.keys(room.players).reduce((collector, playerId) => {
    const player = room.players[playerId]
    if (!player.turnComplete) return false
    return collector
  }, true)
}

const nextTurn = (room) => {
  if (!isTurnComplete(room)) return room
  Object.keys(room.players).forEach(playerId => {
    const player = room.players[playerId]
    player.turnComplete = false
    player.cardOnTable = undefined
    player.wonCards.push(player.cardOnTable)
  })
}

const reducer = (state, action) => {
  if (!state) {
    state = {
      deck: getShuffledDeck(),
      players: {}
    }
  }

  const player = state.players[action.$userId] || {}

  // stops users from playing twice in a row
  if (player.turnComplete) return

  switch (action.type) {
    case 'DRAW_FROM_DECK': {
      if (!action.cards) return
      const hand = player.hand || []
      hand.push(...action.cards)
      player.turnComplete = true
      return nextTurn(state)
    }

    case 'PLAY_CARD': {
      const hand = player.hand || []
      const nextHand = hand.filter(card => card !== action.card)

      // stops users from playing a card they do not have
      if (nextHand.length === hand.length) return

      player.hand = nextHand
      player.cardOnTable = action.card
      player.turnComplete = true
      return nextTurn(state)
    }

    default:
      return state
  }
}

const getShuffledDeck = () => {
  return []
}

const store = jiber.createStore({middleware, reducer})

store.start()
console.log('Warmonger is mongering!')
