export const safeInterval = async (func: Function, ms: number) => {
  try {
    await func()
  } catch (e) {
    console.log(e.message)
  }
  setTimeout(safeInterval, ms, func, ms)
}
