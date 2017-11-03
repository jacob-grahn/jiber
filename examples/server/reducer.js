// a reducer that routes to other reducers depending on the roomId
const reducer = (state, action) => {
  const roomId = action.$r

  switch (roomId) {
    case 'count-clicks':
      return countClicksReducer(state, action)
    case 'draw':
      return drawReducer(state, action)
    default:
      return state
  }
}

// reducer for examples/count-clicks
const countClicksReducer = (state = 0, action) => {
  switch (action.type) {
    case 'CLICK':
      return state + 1
    default:
      return state
  }
}

// reducer for examples/draw
const drawReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PIXEL':
      return {...state, [action.path]: action.color}
    case 'CLEAR':
      return {}
    default:
      return state
  }
}

module.exports = reducer
