const emptyFunc = () => { /* do nothing */}

export const linkMiddleware = (state: any, list: Function[]): Function => {
  const withState = list.map(mw => mw(state))
  const linked = withState.map((mw, index) => {
    const next = withState[index + 1] || emptyFunc
    return mw(next)
  })
  return linked[0] || emptyFunc
}
