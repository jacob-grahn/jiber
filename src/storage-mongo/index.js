const MongoClient = require('mongodb').MongoClient
const settings = {
  mongoUrl: 'mongodb://localhost:27017/rejibetest',
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
  action._rejibeRoomId = action.$roomId
  action._rejibeUserId = action.$userId
  delete action.$roomId
  delete action.$userId
  delete action.$timeMs
  delete action.$actionId

  // strange update to get around the fact that $currentDate doesn't work with inserts
  // https://stackoverflow.com/questions/20620368/is-there-any-equivalent-of-now-in-mongodb/37061284#37061284
  await toPromise(
    collection,
    'update',
    {_id: {$lt: 0}},
    {$set: action, $currentDate: {'_rejibeDate': true}},
    {upsert: true}
  )
}

async function fetchActions (roomId, minTimeMs) {
  const db = await getDb()
  const collection = db.collection(settings.mongoActionCollection)
  const actionCursor = await toPromise(
    collection,
    'find',
    {_rejibeDate: {$gt: new Date(minTimeMs)}}
  )
  const actions = await actionCursor.toArray()
  const parsedActions = actions.map(action => {
    action.$userId = action._rejibeUserId
    action.$roomId = action._rejibeRoomId
    action.$timeMs = new Date(action._rejibeDate).getTime()
    delete action._rejibeUserId
    delete action._rejibeRoomId
    delete action._rejibeDate
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
    {_rejibeDate: {$lte: new Date(minTimeMs)}}
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
