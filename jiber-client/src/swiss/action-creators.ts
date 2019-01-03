import { SPLICE, SET, DELETE, ADD, PUSH } from './swiss'

const toSplice = (path: string, start: number, count: number, ...items: any[]) => {
  return { type: SPLICE, path, start, count, items }
}

export const swissActionCreators = {
  set: (path: string, value: any) => ({ type: SET, path, value }),
  delete: (path: string) => ({ type: DELETE, path }),
  add: (path: string, value: any) => ({ type: ADD, path, value }),
  subtract: (path: string, value: number) => ({ type: ADD, path, value: -value }),
  push: (path: string, value: any) => ({ type: PUSH, path, value }),
  pop: (path: string) => toSplice(path, -1, 1),
  shift: (path: string) => toSplice(path, 0, 1),
  unshift: (path: string, value: any) => toSplice(path, 0, 0, value),
  splice: toSplice
}
