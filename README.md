## Note: Jiber is currently in alpha status. It will likely undergo frequent and un-announced changes.

# [Jiber](https://jiber.io)

[![Build Status](https://travis-ci.org/jacob-grahn/jiber.svg?branch=master)](https://travis-ci.org/jacob-grahn/jiber)
[![Coverage Status](https://coveralls.io/repos/github/jacob-grahn/jiber/badge.svg?branch=master)](https://coveralls.io/github/jacob-grahn/jiber?branch=master)

Jiber is a synchronized data store for browser based multiplayer games.

- **Fast**: Updates are sent peer to peer to minimize latency.
- **Light**: jiber-client is 3kb, and has no dependencies.
- **Offline-First**: User actions are applied optimistically until a connection becomes available.

### Installation
```
npm i jiber-client
```

### Quick Example
```
// Our app logic
// Count how many clicks we get
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'CLICK':
      return state + 1
    default:
      return state
  }
}

// Create a data store, which will sync up our data with other users
const room = $jiber
  .createStore({url: 'localhost', reducer})
  .createRoom('count-clicks')

// Render the page whenever our data changes
room.subscribe(state => document.body.innerHTML = `${state} clicks!`)

// +1 every time we click
window.onclick = () => room.dispatch({type: 'CLICK'})
```

More examples can be found in /examples.

### Documentation
Jiber only has one method, createStore([clientSettings])

An options object can be passed into the createStore method. The available options are

```
const clientSettings = {
  // app logic
  reducer: (state = {}, action) => {
    switch (action.type) {
      case 'HELLO':
        return {...state, [action.$uid]: 'hi'}
      default:
        return state
    }
  },

  // attach helper functions to your room instances.
  actionCreators: {
    sayHello: () => ({type: 'HELLO'})
  },

  // array of middleware that runs before an action is dispatched
  middleware: [],

  // jiber-server to synch data with
  url: 'localhost',

  // port of the jiber-server to sync data with
  socketPort: 80,

  // passed to jiber-server to validate a session
  credential: undefined,

  // array of stun servers to help establish WebRTC connections
  stunServers: [],

  // you could restore state from LocalStorage, etc
  initialState: { sue: 'hi', bob: 'hi' },

  // if a socket connection fails, wait this long before trying to connect again  
  backoffMs: 5000,  

  // maximum number of WebRTC connections to open at once
  maxPeers: 10
}
```

Once you have your options worked out you'll want to create a store, and then create as many rooms
as you need.

```
// jiber-client's one and only method
const store = jiber.createStore(clientSettings)

// get your global state, which contains all rooms
store.getState()
store.subscribe((state, action) => /* do something */)

// join 'room1' to do some serious buisiness
const room = store.createRoom('room1') // join a room that other players can also join

// get the room's state
room.getState() // optimistic, lower latency
room.getConfirmedState() // confirmed, higher latency
room.subscribe((roomState, action)) => /* do something */)

// change the room's state
room.dispatch({type: 'HELLO'}) // this is sent to your reducer in clientSettings.reducer
room.sayHello() // the same as the line above, thanks to clientSettings.actionCreators
```


### Contributing
See CONTRIBUTING.md

### License
MIT
