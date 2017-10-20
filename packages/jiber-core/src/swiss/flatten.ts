export const flatten = (obj: any, prepend: string = ''): any => {
  const result: any = {}

  Object.keys(obj).map(key => {
    const value: any = obj[key]
    if (typeof value === 'object') {
      const subResults = flatten(value, `${prepend}${key}.`)
      Object.assign(result, subResults)
    } else {
      result[`${prepend}${key}`] = value
    }
  })

  return result
}
