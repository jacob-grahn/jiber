interface Storage {
  getState: () => any,
  setState: (state: any) => void
}

export { Storage as default }
