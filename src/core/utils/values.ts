/**
 * I'm currently targeting ES6, which doesn't include Object.values
 */
export default function values (obj: {[key: string]: any}): Array<any> {
  const keys = Object.keys(obj)
  const values = keys.map(key => obj[key])
  return values
}
