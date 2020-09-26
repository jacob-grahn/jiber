/**
 * Return the value of a path
 */
export const get = (data: any, path: string = '', defaultValue: any = undefined): any => {
  if (!path) return data
  const bits = path.split('.')
  const value = bits.reduce(
    (value, key) => value ? value[key] : undefined,
    data
  )
  if (value === undefined) {
    return defaultValue
  } else {
    return value
  }
}
