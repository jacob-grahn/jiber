# [Jiber](https://jiber.io)

Jiber is a synchronized data store. It is well suited for real-time apps with
data that changes often.

- **Fast**: Updates are transmitted nearly instantly via WebSockets.
- **Tiny**: jiber-client is 3kb, and has no dependencies.
- **Offline-First**: User actions are applied optimistically until an internet
connection becomes available.

### Installation
```
npm i jiber-client
```

### Hello World Example
```
// This example uses a free test server from jiber.io
// You could also set up your own, see /jiber-server in this repo

// Create our data store, which will connect and sync up our data
const store = jiber.createStore({url: 'localhost'})

// Pick a room to join. I have creatively chosen 'room1'
const room = store.createRoom('room1')

// Display how many glorious clicks we have collectively achieved
const render = (state) => {
    document.body.innerHTML = `
        Hello world, curious people have clicked
        on this page <b>${state.clickCount}</b> times!
    `
}

// Render the page whenever the room changes
room.subscribe(render)

// +1 every time we click
window.onclick = () => {
  room.dispatch({type: 'INCREMENT', path: 'clickCount', value: 1})
}
```

More examples can be found in /examples.
