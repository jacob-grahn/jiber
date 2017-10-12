const MongoClient = require('mongodb').MongoClient
const settings = {
  mongoUrl: 'mongodb://localhost:27017/jibertest',
  mongoActionCollection: 'actions',
  mongoRoomCollection: 'rooms'
}
const db = toPromise(MongoClient, 'connect', settings.mongoUrl)

async function getDb () {
  return db
}

function toPromise () {
  const [caller, func, ...args] = Array.from(arguments)
  return new Promise((resolve, reject) => {
    caller[func](...args, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

async function pushAction (roomId, action) {
  const db = await getDb()
  const collection = db.collection(settings.mongoActionCollection)
  action._jiberRoomId = action.$r
  action._jiberUserId = action.$u
  delete action.$r
  delete action.$u
  delete action.$t
  delete action.$id

  // strange update to get around the fact that $currentDate doesn't work with inserts
  // https://stackoverflow.com/questions/20620368/is-there-any-equivalent-of-now-in-mongodb/37061284#37061284
  await toPromise(
    collection,
    'update',
    {_id: {$lt: 0}},
    {$set: action, $currentDate: {'_jiberDate': true}},
    {upsert: true}
  )
}

async function fetchActions (roomId, minTimeMs) {
  const db = await getDb()
  const collection = db.collection(settings.mongoActionCollection)
  const actionCursor = await toPromise(
    collection,
    'find',
    {_jiberDate: {$gt: new Date(minTimeMs)}}
  )
  const actions = await actionCursor.toArray()
  const parsedActions = actions.map(action => {
    action.$u = action._jiberUserId
    action.$r = action._jiberRoomId
    action.$t = new Date(action._jiberDate).getTime()
    delete action._jiberUserId
    delete action._jiberRoomId
    delete action._jiberDate
    delete action._id
    return action
  })
  return parsedActions
}

async function removeActions (roomId, minTimeMs) {
  const db = await getDb()
  const collection = db.collection(settings.mongoActionCollection)
  await toPromise(
    collection,
    'removeMany',
    {_jiberDate: {$lte: new Date(minTimeMs)}}
  )
}

async function fetchState (roomId) {
  const db = await getDb()
  const collection = db.collection(settings.mongoRoomCollection)
  const state = await toPromise(collection, 'findOne', {_id: roomId})
  if (!state) {
    return {
      members: {},
      confirmedState: undefined,
      lastUpdatedAt: 0
    }
  }
  return state
}

async function storeState (roomId, state) {
  const db = await getDb()
  const collection = db.collection(settings.mongoRoomCollection)
  await toPromise(
    collection,
    'update',
    {_id: roomId}, {$set: state}, {upsert: true}
  )
}

module.exports = {
  pushAction,
  fetchActions,
  removeActions,
  fetchState,
  storeState
}
