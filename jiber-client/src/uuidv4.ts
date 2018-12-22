// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

const template = '10000000-1000-4000-80000000-100000000000'

export const uuidv4 = () => {
  return template.replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
