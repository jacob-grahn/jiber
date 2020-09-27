import { get } from './get'

const strRegex = new RegExp(`(^".*"$|^'.*'$)`)

export const parseParams = (state: any, param: string|number|boolean|undefined) => {
    if (typeof param === 'number') {
        return param
    }
    else if (typeof param === 'boolean') {
        return param
    }
    else if (typeof param === 'undefined') {
        return param
    }
    else if(strRegex.test(param)) {
        return param.substring(1, param.length - 2)
    }
    else {
        return get(state, param)
    }
}