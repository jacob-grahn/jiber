/**
 * Return the value of a path
 */
export const get = (data: any, path: string | string[] = '', defaultValue: any = undefined): any => {
  if (!path) return data
  if (!Array.isArray(path)) path = path.split('.')
  const value = path.reduce(
    (value, key) => value ? value[key] : undefined,
    data
  )
  if (value === undefined) {
    return defaultValue
  } else {
    return value
  }
}
