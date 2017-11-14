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

module.exports = drawReducer
