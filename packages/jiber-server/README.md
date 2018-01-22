### Installation
```
npm i jiber-server
```

### Quick Example
```
const store = jiber.createStore()
store.start() // jiber-server is now listening on port 80
```

More examples can be found in ../examples.

### Documentation
An options object can be passed into the createStore method. The available options are

```
const serverSettings = {
  // app logic
  reducer: (state = {}, action) => {
    switch (action.type) {
      case 'HELLO':
        return {...state, [action.$uidid]: 'hi'}
      default:
        return state
    }
  },

  // you could restore state from a db, etc
  initialState: { sue: 'hi', bob: 'hi' },

  // validate logins
  login: async (credential) => {
    return { uid: randStr(12) }
  },

  // custom backend, check out jiber-db-redis for documentation
  db: jiberDbRedis,

  // how often to save s to the db
  snapshotInterval: 5000, // five seconds

  // how long to leave an inactive  in memory
  maxDocAge: 3600000, // one hour
}
```

See Jiber's Docs at [docs.jiber.io](http://docs.jiber.io)

### License
MIT
