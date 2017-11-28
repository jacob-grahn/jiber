``` javascript
const settings = {
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
  url: 'ws://localhost:80',

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
--------------------------------------------------------------------------------


# reducer
App logic

__Default__  
``` javascript
(state: any = {}, action: Action): any => {
  switch (action.type) {
    case SET:
      if (typeof action.set !== 'object') return state
      return { ...state, ...action.set }
    default:
      return state
  }
}
```
--------------------------------------------------------------------------------


# actionCreators
Attach helper functions to your room instances.

__Default__  
``` javascript
{
  set: (obj: any) => ({ type: SET, set: obj })
}
```
--------------------------------------------------------------------------------


# middleware
Array of middleware that runs before an action is dispatched.

__Default__  
[]
--------------------------------------------------------------------------------


# url
Url of a jiber-server to synch data with.

__Default__  
undefined
--------------------------------------------------------------------------------


# credential
Passed to jiber-server to validate a session.

__Default__  
undefined
--------------------------------------------------------------------------------


# stunServers
Array of stun servers to help establish WebRTC connections.

__Default__  
[]
--------------------------------------------------------------------------------


# initialState
You could restore state from LocalStorage, etc.

__Default__  
undefined
--------------------------------------------------------------------------------


# backoffMs
If a socket connection fails, wait this long before trying to connect again.

__Default__  
5000
--------------------------------------------------------------------------------


# maxPeers
Maximum number of WebRTC connections to open at once.

__Default__  
10
