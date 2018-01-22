# getState()
__Aruguments__  
 - None!

__Returns__  
 - (any): The optimistic state of this doc.

__Example__
``` javascript
const state = doc.getState()
console.log(state)
```
--------------------------------------------------------------------------------


# getConfirmedState()
__Aruguments__  
- None!

__Returns__  
- (any): The confirmed state of this doc.

__Example__
``` javascript
const state = doc.getConfirmedState()
console.log(state)
```
--------------------------------------------------------------------------------


# subscribe(handler)
__Aruguments__  
- (Function): Handler function that will be called whenever the doc is changed.

__Returns__  
- (Function): Cancellation function to end the subscription

__Example__
``` javascript
// log all state changes for the next 30 seconds
const cancel = doc.subsribe((state, action) => console.log(state, action))
setTimeout(cancel, 30000)
```
--------------------------------------------------------------------------------


# dispatch(action)
__Aruguments__  
- (Action): An action that is meant to update this doc's state.

__Returns__  
- (void)

__Example__
``` javascript
doc.dispatch({type: 'EAT_APPLES', quantity: 5})
```
--------------------------------------------------------------------------------


# [any]
If you provide the actionCreators option when initializing jiber-client,
those methods will become available on your doc instances.

__Aruguments__  
- (any): An argument to pass to your action creator.  
- ...(any): More arguments to pass to your action creator.

__Returns__  
- (void)

__Example__
``` javascript
const store = jiber.createStore({
  actionCreators: {
    eatApples: (quantity) => ({type: 'EAT_APPLES', quantity})
  }
})
const doc = store.joinRoom('apple-feast')
doc.eatApples(5)
```
