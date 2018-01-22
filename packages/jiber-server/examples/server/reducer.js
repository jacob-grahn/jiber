const countClicksReducer = require('./reducers/count-clicks-reducer')
const drawReducer = require('./reducers/draw-reducer')
const walkingReducer = require('./reducers/walking-reducer')
const jiberCore = require('jiber-core')

// a reducer that routes to other reducers depending on the roomId
const reducer = (state, action) => {
  const roomId = action.$doc

  switch (roomId) {
    case 'draw':
      return drawReducer(state, action)
    case 'count-clicks':
      return countClicksReducer(state, action)
    case 'walking':
      return walkingReducer(state, action)
    default:
      return jiberCore.patcher(state, action)
  }
}

module.exports = reducer
