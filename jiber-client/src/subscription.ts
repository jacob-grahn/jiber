export class Subscription {

  // all of the listeners that have subscribed
  private subscribers: Function[] = []

  // add a listener, and return a function to remove that listener
  subscribe (subscriber: Function) {
    this.subscribers.push(subscriber)
    return () => this.removeSubscriber(subscriber)
  }

  // send a message to all listeners
  publish (...args: any[]) {
    this.subscribers.forEach(subscriber => subscriber(...args))
  }

  // remove a subscriber func
  removeSubscriber (subscriber: Function) {
    this.subscribers = this.subscribers.filter(s => s !== subscriber)
  }

  //
  removeAllSubscribers () {
    this.subscribers = []
  }
}
