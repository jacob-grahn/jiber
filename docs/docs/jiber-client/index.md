# jiberClient.createStore(settings)

### Arguments
 - settings: An object containing customization options
### Example
```javascript
const settings = {
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

const store = jiberClient.createStore(settings)
```
