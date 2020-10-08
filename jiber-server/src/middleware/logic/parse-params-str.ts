import { get } from '../../swiss/get'

const interpolateRegex = new RegExp('\\\[(.*?)\\\]', 'g')

export const parseParamsStr = (state: any, str: string) => {
  let indexMod = 0
  const fields = [...str.matchAll(interpolateRegex)]
  fields.forEach(field => {
    const match = field[0]
    const group = field[1]
    const index = (field.index || 0) + indexMod
    const len = match.length
    const before = str.substring(0, index)
    const after = str.substring(index + len)
    let value = get(state, group)
    if (before !== '') {
      value = '.' + value
    }
    indexMod += value.length - match.length
    str = before + value + after
  })
  return str
}
