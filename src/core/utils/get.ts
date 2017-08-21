export const get = (value: any, path: string|string[] = ''): any => {
  if (!path) return value
  if (!Array.isArray(path)) path = path.split('.')
  return path.reduce(
    (value, key) => value ? value[key] : undefined,
    value
  )
}
