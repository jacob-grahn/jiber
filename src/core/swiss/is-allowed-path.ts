export const isAllowedPath = (allowedPaths: any[], path: string): boolean => {
  if (Array.isArray(allowedPaths)) {
    const matches = allowedPaths.filter(allowedPath => {
      if (typeof allowedPath === 'string') {
        return path.indexOf(allowedPath) === 0
      }
      if (allowedPath.test) {
        return allowedPath.test(path)
      }
    })
    if (matches.length > 0) return true
  }
  return false
}
