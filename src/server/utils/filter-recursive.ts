const defaultTestFunc = (_key: string|number, value: any) => !!value

export default function filterRecursive (
  data: any,
  testFunc: (key: string|number, value: any) => boolean = defaultTestFunc
): any {
  if (!data) return data
  if (typeof data === 'number') return data
  if (typeof data === 'boolean') return data
  if (typeof data === 'string') return data
  if (Array.isArray(data)) {
    return data.reduce((resultArray, value, index) => {
      if (testFunc(index, value)) {
        resultArray.push(filterRecursive(value, testFunc))
      }
      return resultArray
    }, [])
  }
  if (typeof data === 'object') {
    return Object.keys(data).reduce((resultObj, key) => {
      const value = data[key]
      if (testFunc(key, value)) {
        resultObj[key] = filterRecursive(value, testFunc)
      }
      return resultObj
    }, {} as {[key: string]: any})
  }
}
