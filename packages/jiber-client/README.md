### Installation
```
npm i jiber-client
```

### Quick Example
```
// Create a data store, which will sync up our data with other users
const doc = $jiber
  .createStore({url: 'wss://demo.jiber.io'})
  .open('example')

// set a value
doc.set({phrase: 'hello world'})

// get a value
alert(doc.getState().phrase)
```

This example used the default reducer, which provides the doc.set() method.
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
        return {...state, [action.$uid]: 'hi'}
      default:
        return state
    }
  },

  // attach helper functions to your doc instances.
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

Once you have your options worked out you'll want to create a store, and then create as many docs
as you need.

```
// jiber-client's one and only method
const store = jiber.createStore(clientSettings)

// get your global state, which contains all docs
store.getState()
store.subscribe((state, action) => /* do something */)

// join 'doc1' to do some serious business
const doc = store.open('doc1') // open a doc

// get the doc's state
doc.getState() // optimistic, lower latency
doc.getConfirmedState() // confirmed, higher latency
doc.subscribe((state, action)) => /* do something */)

// change the doc's state
doc.dispatch({type: 'HELLO'}) // this is sent to your reducer in clientSettings.reducer
doc.sayHello() // the same as the line above, thanks to clientSettings.actionCreators
```

See Jiber's Docs at [docs.jiber.io](http://docs.jiber.io)

### License
MIT
