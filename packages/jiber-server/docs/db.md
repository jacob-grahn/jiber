``` typescript
interface DB {
  emitter: EventEmitter,
  pushAction: (action: Action) => void,
  fetchState: (Id: string) => Promise<DocState>,
  stashState: (Id: string, state: DocState) => void
}
```
