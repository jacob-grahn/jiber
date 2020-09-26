/**
 * Set a value at path
 */
export const set = (obj: any, path: string | string[], value: any): any => {
  if (!path) return value
  if (!Array.isArray(path)) path = path.split('.')
  if (path.length === 0) return value
  const [key, ...remainingKeys] = path
  const oldValue = obj[key] || {}
  const newValue = set(oldValue, remainingKeys, value)

  if (Array.isArray(obj)) {
    obj[Number(key)] = newValue
  } else {
    obj[key] = newValue
  }
  
  return obj
}
