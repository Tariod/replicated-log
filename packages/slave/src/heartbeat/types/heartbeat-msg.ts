export enum PingPong {
  PING = 'PING',
  PONG = 'PONG',
}

export type HeartbeatMsg<T = PingPong> = { message: T };
