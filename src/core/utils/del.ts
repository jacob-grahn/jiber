import get from './get'
import set from './set'

export default function del (obj: any, path: string|string[] = ''): any {
  if (!path) return undefined
  if (!Array.isArray(path)) path = path.split('.')
  if (path.length === 0) return undefined
  const parentPath = path.slice(0, path.length - 1)
  const delKey = path[path.length - 1]
  const parent = get(obj, parentPath)
  if (!parent) return obj

  let parentCopy: any
  if (Array.isArray(parent)) {
    const index = Number(delKey)
    parentCopy = parent.slice(0, index)
    if (index < parent.length - 1) {
      parentCopy = parentCopy.concat(parent.slice(index + 1))
    }
  } else {
    parentCopy = {...parent}
    delete parentCopy[delKey]
  }
  return set(obj, parentPath, parentCopy)
}
