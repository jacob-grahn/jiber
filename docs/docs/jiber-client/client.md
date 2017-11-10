# createStore([settings])

__Arguments__  
 - ([[ClientSettings](settings.md)]): An object containing customization options

__Returns__  
  - ([Store](store.md)): A shared data store.

__Example__
``` javascript
import jiber from 'jiber-client'
const store = jiber.createStore()
```

# combineReducers(dictionary)

__Arguments__  
  - (Object): Dictionary of reducers to combine into one.

__Returns__  
  - (Reducer): A single reducer.

__Example__
``` javascript
const favMovies = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return [...state, action.movie]
    default:
      return state
  }
}
const favSongs (state = [], action) => {
  switch (action.type) {
    case 'ADD_SONG':
      return [...state, action.song]
    default:
      return state
  }
}
const reducer = combineReducers({ favMovies, favSongs })
const state = reducer(undefined, {type: 'ADD_MOVIE', movie: 'Dr. Strangelove'})
// state equals {favSongs: [], favMovies: ['Dr. Strangelove']}
```
