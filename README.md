Rejibe is a multi-user state container for JavaScript apps.

### Perks
- Offline First
- Optimistic
- Fast (updates are sent via WebSockets)
- Tiny (rejibe-client is 3kb, and has no dependencies)

### Installation
Client
```
npm i rejibe-client
```

Server
```
npm i rejibe-server
```

### Example
Here is an app that counts the number of times any user has clicked the page.
Client
```
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
const store = $rejibe.createStore({url: 'localhost', reducer: clickCounter})

// Pick a room to join
const room = store.createRoom('room1')

// Display the click count on the screen
room.subscribe(() => {
  document.body.innerHTML = `There have been ${room.getState()} clicks!`
})

// click handler
window.onclick = () => room.dispatch({type: 'CLICK'})
```

Server
```
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
```

More examples can be found in the examples directory of this repo.
