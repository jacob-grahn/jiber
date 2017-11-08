# room.getState()
##### Aruguments
- None!
##### Returns
- (any): The optimistic state of this room.
##### Example
``` javascript
const state = room.getState()
console.log(state)
```

# room.getConfirmedState()
##### Aruguments
- None!
##### Returns
- (any): The confirmed state of this room.
##### Example
``` javascript
const state = room.getConfirmedState()
console.log(state)
```

# room.subscribe(handler)
##### Aruguments
- (Function): Handler function that will be called whenever the room is changed.
##### Returns
- (Function): Cancellation function to end the subscription
##### Example
``` javascript
// log all state changes for the next 30 seconds
const cancel = room.subsribe((state, action) => console.log(state, action))
setTimeout(cancel, 30000)
```

# room.dispatch(action)
##### Aruguments
- (Action): An action that is meant to update this room's state.
##### Returns
- (void)
##### Example
``` javascript
room.dispatch({type: 'EAT_APPLES', quantity: 5})
```

# room.*
If you provide the actionCreators option when initializing jiber-client,
those methods will become available on your room instances.
##### Aruguments
- (any): An argument to pass to your action creator.
- ...
##### Returns
- (void)
##### Example
``` javascript
const store = jiber.createStore({
  actionCreators: {
    eatApples: (quantity) => ({type: 'EAT_APPLES', quantity})
  }
})
const room = store.joinRoom('apple-feast')
room.eatApples(5)
```
