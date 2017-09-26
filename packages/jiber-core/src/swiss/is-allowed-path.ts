export const isAllowedPath = (
  allowedPaths: any,
  path: string = ''
): boolean => {
  if (!Array.isArray(allowedPaths)) {
    allowedPaths = [allowedPaths]
  }
  const matches = allowedPaths.filter((allowedPath: any) => {
    if (typeof allowedPath === 'string') {
      return path.indexOf(allowedPath) === 0
    }
    if (!allowedPath) {
      return false
    }
    if (allowedPath.test) {
      return allowedPath.test(path)
    }
  })
  return (matches.length > 0)
}
