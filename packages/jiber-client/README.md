### Installation
```
npm i jiber-client
```

### Quick Example
```
// Create a data store, which will sync up our data with other users
const room = $jiber
  .createStore({url: 'wss://demo.jiber.io'})
  .createRoom('example')

// set a value
room.set({phrase: 'hello world'})

// get a value
alert(room.getState().phrase)
```

This example used the default reducer, which provides the room.set() method.
Custom reducers and custom methods can be used!
More examples can be found in /examples.

### Documentation
An options object can be passed into the createStore method. The available options are

```
const clientSettings = {
  // app logic
  reducer: (state = {}, action) => {
    switch (action.type) {
      case 'HELLO':
        return {...state, [action.$userIdid]: 'hi'}
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
  url: 'ws://localhost',

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

See Jiber's Docs at [docs.jiber.io](http://docs.jiber.io)

### License
MIT
