## Note: Jiber is currently in alpha status. It will likely undergo frequent and un-announced changes. 

# [Jiber](https://jiber.io)

[![Coverage Status](https://coveralls.io/repos/github/Jiggmin/Jiber/badge.svg?branch=master)](https://coveralls.io/github/Jiggmin/Jiber?branch=master)

Jiber is a synchronized data store. It is well suited for real-time apps with
data that changes often.

- **Fast**: Updates are sent peer to peer to minimize latency.
- **Light**: jiber-client is 3kb, and has no dependencies.
- **Offline-First**: User actions are applied optimistically until an internet
connection becomes available.

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
