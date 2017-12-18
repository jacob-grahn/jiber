``` typescript
interface DB {
  emitter: EventEmitter,
  pushAction: (action: Action) => void,
  fetchState: (roomId: string) => Promise<RoomState>,
  stashState: (roomId: string, state: RoomState) => void
}
```
