const combineReducers = window.$hope.combineReducers
const dict = window.$hope.dict
const allowedStocks = ['TSLA', 'IBM', 'GILD']
const allowedOrderTypes = ['BUY', 'SELL']

const isValidOrder = (order) => {
  if (!order) return false
  if (typeof order !== 'object') return false
  if (typeof order.id !== 'number') return false
  if (typeof order.stock !== 'string') return false
  if (typeof order.quantity !== 'number') return false
  if (typeof order.price !== 'number') return false
  if (typeof order.type !== 'string') return false
  if (allowedStocks.indexOf(order.stock) === -1) return false
  if (allowedOrderTypes.indexOf(order.type) === -1) return false
  if (order.quantity <= 0) return false
  if (order.price <= 0) return false
  return true
}

const getUniqueId = () => {
  return Math.round(Math.random() * 1000000)                                    // a bad and lazy way to make unique Ids
}

const orders = (state = [], action) => {
  switch (action.type) {
    case '$serverOnly/ADD_ORDER':
      const order = {...action.order, id: getUniqueId()}
      if (!isValidOrder(order)) return state
      return [...state, order]
    case '$serverOnly/DEL_ORDER':
      return state.flter(order => order.id !== action.orderId)
    default:
      return state
  }
}

const priceHistory = dict((state = [], action) => {
  switch (action.type) {
    case '$serverOnly/SALE':
      return [...state, action.price]
    default:
      return state
  }
}, 'stock')

const $user = combineReducers({orders})
const stockExcange = combineReducers({$user, priceHistory})

export default stockExcange
