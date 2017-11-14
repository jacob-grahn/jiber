const countClicksReducer = require('./reducers/count-clicks-reducer')
const drawReducer = require('./reducers/draw-reducer')
const walkingReducer = require('./reducers/walking-reducer')

// a reducer that routes to other reducers depending on the roomId
const reducer = (state, action) => {
  const roomId = action.$r

  switch (roomId) {
    case 'draw':
      return drawReducer(state, action)
    case 'count-clicks':
      return countClicksReducer(state, action)
    case 'walking':
      return walkingReducer(state, action)
    default:
      return state
  }
}

module.exports = reducer
