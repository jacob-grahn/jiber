// ensure that only one instance of an async function runs at a time
// If the called function is already running, schedule it to run later
// There may be an existing word for this like debounce or memoize
// but I don't know what that word is

export default function noConcurrent (
  func: (...args: any[]) => Promise<any>
): (...args: any[]) => Promise<void> {
  const running: {[key: string]: boolean} = {}
  const scheduled: {[key: string]: boolean} = {}

  return async function startAsync (): Promise<any> {
    const args = Array.from(arguments)
    const key = hasher(args)

    if (running[key]) {
      scheduled[key] = true
      return
    }

    running[key] = true
    await func(...args)
    running[key] = false

    if (scheduled[key]) {
      scheduled[key] = false
      return startAsync()
    }
  }
}

function hasher (args: any[]): string {
  return args.map(String).join(',')
}
