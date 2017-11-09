``` javascript
{
  socketPort: 80,
  stunPort: 3478,
  reducer: patcher,
  login: memAccounts,
  db: memoryDB,
  snapshotInterval: 5000,                                                       // five seconds
  syncInterval: 1000,                                                           // one second
  maxRoomAge: 1000 * 60 * 60,                                                   // one hour
  initialState: undefined
}
```

# socketPort
The port to listen for incoming client connections on.

__Default__  
80
--------------------------------------------------------------------------------

# stunPort

TODO: remove this?

__Default__  
3478
--------------------------------------------------------------------------------

# reducer
Your app logic.

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

# login
A function to login users as they connect.

__Default__  
``` javascript
async (credential) => {
  return { userId: randStr(12) }
}
```
--------------------------------------------------------------------------------

# db
An instance of [DB](db.md). This controlls how jiber-server instances share and
store their data.

__Default__  
jiber-server/src/memory-db/memory-db.ts
--------------------------------------------------------------------------------

# snapshotInterval
How often to save room states to the db.

__Default__  
5000
--------------------------------------------------------------------------------

# syncInterval
Todo: remove this?

__Default__  
1000
--------------------------------------------------------------------------------

# maxRoomAge
How long to store an inactive room in active memory before closing it.
(A closed room is still saved in the db, and can be re-opened)

__Default__  
360000
--------------------------------------------------------------------------------

# initialState
This setting can be used to restore a previously saved state.

__Default__  
undefined
