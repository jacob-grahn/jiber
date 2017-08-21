export const set = (obj: any, path: string|string[], value: any): any => {
  if (!path) return value
  if (!Array.isArray(path)) path = path.split('.')
  if (path.length === 0) return value
  const [key, ...remainingKeys] = path
  const oldValue = obj[key] || {}
  const newValue = set(oldValue, remainingKeys, value)

  if (Array.isArray(obj)) {
    const newArr = [...obj]
    newArr[Number(key)] = newValue
    return newArr
  } else {
    return {...obj, [key]: newValue}
  }
}
