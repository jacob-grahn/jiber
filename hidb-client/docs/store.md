# getState()
__Arguments__  
- None!

__Returns__  
- (ClientState): Returns the client's global state.
This includes the optimistic and confirmed state for all docs.

__Example__
``` javascript
// log every doc we are a member of
const state = store.getState()
console.log(Object.keys(state.docs))
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


# open('doc-name')
__Arguments__  
- (string): The Name of the doc you would like to open.

__Returns__  
- ([Doc](doc.md)): A Doc instance.

__Example__
``` javascript
const doc = store.open('smelly-beans')
```
