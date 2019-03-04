const emptyFunc = () => { /* do nothing */}

export const linkMiddleware = (state: any, list: Function[]): Function => {
  let last = emptyFunc
  list.slice().reverse().forEach(mw => {
    last = mw(state)(last)
    return last
  })

  return last
}
