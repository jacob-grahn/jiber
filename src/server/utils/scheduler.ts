/*
 * Set up an interval, and provide a simple way to start and stop the interval
 */
export const createScheduler = (func: () => any, interval: number) => {
  let id: any

  const stop = () => {
    if (id) clearInterval(id)
    id = undefined
  }

  const start = () => {
    stop()
    func()
    id = setInterval(func, interval)
  }

  return {
    start,
    stop
  }
}
