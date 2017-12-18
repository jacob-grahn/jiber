# getState()
__Arguments__  
- None!

__Returns__  
- (ServerState): Returns the servers's global state.
This includes state and members of all rooms.

__Example__
``` javascript
// log every room we are a member of
const state = store.getState()
console.log(Object.keys(state.rooms))
```
--------------------------------------------------------------------------------


# subscribe()
__Arguments__  
- (Function): A function that will be called
whenever the data in the store is changed.

__Returns__  
- (Function): A cancellation function.
Call this function to cancel the subscription.

__Example__
``` javascript
// log all state changes for 30 seconds, then stop
const cancel = store.subscribe((state, action) => console.log(state, action))
setTimeout(cancel, 30000)
```
--------------------------------------------------------------------------------


# start()
Start listening for incoming connections.

__Arguments__  
- None

__Returns__  
- (void)

__Example__
``` javascript
const jiber = require('jiber-server')
const store = jiber.createStore()
store.start()
// jiber-server is now active and listening for connections!
```
--------------------------------------------------------------------------------


# stop()
Stop listening for incoming connections.

__Arguments__  
- None

__Returns__  
- (void)

__Example__
``` javascript
const jiber = require('jiber-server')
const store = jiber.createStore()
store.start()
store.stop()
// no one can connect!
```
