import { get } from './get'

const interpolateRegex = new RegExp('\\\[(.*?)\\\]', 'g')


export const parseParamsStr = (state: any, str: string) => {
    const fields = [...str.matchAll(interpolateRegex)]
    fields.forEach(field => {
        const match = field[0]
        const group = field[1]
        const index = field.index || 0
        const len = match.length
        const before = str.substring(0, index)
        const after = str.substring(index + len)
        const value = get(state, group)
        str = before + '.' + value + after
    })
    return str
}