export interface User {
  userId: string,
  actionId?: number,
  socketId?: string,
  public?: any,
  grantRead?: string[] | RegExp[],
  grantWrite?: string[] | RegExp[]
}
