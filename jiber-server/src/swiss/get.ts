/**
 * Return the value of a path
 */
export const get = (value: any, path: string | string[] = ''): any => {
  if (!path) return value
  if (!Array.isArray(path)) path = path.split('.')
  return path.reduce(
    (val, key) => {
      if (!val) {
        return undefined
      }
      if (val.$ref) {
        val = get(value, val.$ref)
        if (!val) {
          return undefined
        }
      }
      return val[key]
    },
    value
  )
}