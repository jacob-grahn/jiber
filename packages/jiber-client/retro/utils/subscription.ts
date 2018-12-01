export const createSubscription = () => {

  // all of the listeners that have subscribed
  let subscribers: Function[] = []

  // add a listener, and return a function to remove that listener
  const subscribe = (listener: Function) => {
    subscribers.push(listener)
    return () => {
      subscribers = subscribers.filter(subscriber => subscriber !== listener)
    }
  }

  // send a message to all listeners
  const publish = (...args: any[]) => {
    subscribers.forEach(subscriber => subscriber(...args))
  }

  // public interface
  return { subscribe, publish }
}
