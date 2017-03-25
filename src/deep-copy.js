/**
* Make a deep copy of an object
* I imagine this implementation is very slow
* @param {*} val - object to be copied
* @returns {*} - a deep copy of the object
*/
export default function deepCopy (val) {
  return JSON.parse(JSON.stringify(val))
}
