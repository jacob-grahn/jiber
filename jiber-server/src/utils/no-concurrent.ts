/**
 * turn an array of values into a single string
 */
const hasher = (args: any[]): string => {
  return args.map(String).join(',')
}

/**
 * ensure that only one instance of an async function runs at a time
 * If the called function is already running, schedule it to run later
 * There may be an existing word for this like debounce or memoize
 * but I don't know what that word is
 */
export const noConcurrent = (
  func: (...args: any[]) => Promise<any>
) => {
  const running: {[key: string]: boolean} = {}
  const scheduled: {[key: string]: boolean} = {}

  const startAsync = async (...args: any[]): Promise<any> => {
    const key = hasher(args)

    if (running[key]) {
      scheduled[key] = true
      return undefined
    }

    running[key] = true
    await func(...args)
    running[key] = false

    if (scheduled[key]) {
      scheduled[key] = false
      return startAsync(...args)
    }
  }

  return startAsync as (...args: any[]) => Promise<void>
}
