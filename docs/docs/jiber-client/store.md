# store.getState()
##### Arguments
- None!
##### Returns
- (ClientState): Returns the client's global state.
This includes the optimistic and confirmed state for all rooms.
##### Example
``` javascript
// log every room we are a member of
const state = store.getState()
console.log(Object.keys(state.rooms))
```


# store.subscribe()
#### Arguments
- (Function): A function that will be called
whenever the data in the store is changed.
#### Returns
- (Function): A cancellation function.
Call this function to cancel the subscription.
#### Example
``` javascript
// log all state changes for 30 seconds, then stop
const cancel = store.subscribe((state, action) => console.log(state, action))
setTimeout(cancel, 30000)
```


# store.createRoom('room-name')
##### Arguments
- (string): The Name of the room you would like to join.
##### Returns
- (Room): A [Room](/jiber-client/room) instance.
##### Example
``` javascript
const room = store.createRoom('smelly-beans')
```
