/*
keep a subset of the shared space writable only to those that have a matching
value in their user account
*/
export const canWrite = (path: string[], user: any = undefined): boolean => {
  if (path.length === 0) return false
  if (!path[0]) return false
  if (path[0] !== 'protected') return true
  if (path.length < 3) return false
  if (!user) return false
  const key = path[1]
  const value = path[2]
  return user[key] === value
}
