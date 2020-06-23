[![Jiber](jiber.gif)](https://jiber.io)

![Build Status](https://github.com/jacob-grahn/jiber/workflows/Run%20Tests/badge.svg)

Jiber is an open source API for realtime web apps. It sets up peer-to-peer connections via webRTC, and backs that up with a more reliable client/server WebSocket connection.

- **Fast**: Updates are sent peer to peer to minimize latency.
- **Light**: jiber-client is 3kb, and has no dependencies.
- **Offline-First**: User actions are applied optimistically until a connection becomes available.

### Live Demos
  - [Global Switch](https://codepen.io/jacob-grahn/pen/BmqzpR)
  - [Draw with Friends](https://codepen.io/jacob-grahn/pen/mqGmWb)

### Server Installation
```
npm i jiber-server
```

### Client Installation
```
npm i jiber-client
```

### Documentation
- [Get Started with jiber-server](/packages/jiber-server)
- [Get Started with jiber-client](/packages/jiber-client)
- See Jiber's Docs at [docs.jiber.io](http://docs.jiber.io)

### Examples
Examples can be found in [/examples](/examples).

### Contributing
See [CONTRIBUTING.md](/CONTRIBUTING.md)

### License
MIT
