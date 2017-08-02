/*
 * Set up an interval, and provide a simple way to start and stop the interval
 */

export default function scheduler (func: Function, interval: number) {
  let id: any

  function start () {
    stop()
    func()
    id = setInterval(func, interval)
  }

  function stop () {
    if (id) clearInterval(id)
    id = undefined
  }

  return {
    start,
    stop
  }
}
