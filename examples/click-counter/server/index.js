const rejibe = require('rejibe-server')

// Count how many times the screen is clicked
// This reducer function should be the same on the client and server
const clickCounter = (state = 0, action) => {
  switch (action.type) {
    case 'CLICK':
      return state + 1
    default:
      return state
  }
}

// Pass our custom app logic to rejibe
const store = rejibe.createStore({reducer: clickCounter})

// Start listening for incomming connections
store.start()
console.log("Click Counter's Server is runnning!")
