const jiber = require('jiber-server')

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

// Pass our custom app logic to jiber
const store = jiber.createStore({reducer: clickCounter})

// Start listening for incomming connections
store.socketServer.start()
console.log("Click Counter's Server is runnning!")
