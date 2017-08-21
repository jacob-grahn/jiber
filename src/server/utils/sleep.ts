export const sleep = (timeMs: number) => {
  return new Promise(resolve => setTimeout(resolve, timeMs))
}
