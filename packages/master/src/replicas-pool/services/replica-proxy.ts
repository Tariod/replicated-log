import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  concat,
  distinctUntilChanged,
  first,
  interval,
  map,
  mergeMap,
  of,
  repeat,
  timeout,
} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { SERVER_CONFIG, ServerConfig } from '../../config/server.config';

import {
  HealthStatus,
  HeartbeatMsg,
  PingPong,
  ReplicaProxySendPattern,
} from '../types';

export class ReplicaProxy {
  private readonly heartbeat: Observable<HealthStatus>;

  private readonly $health: BehaviorSubject<HealthStatus>;

  constructor(
    public readonly label: string,
    private readonly config: ConfigService,
    private readonly client: ClientProxy,
  ) {
    const { heartbeat_interval: HEARTBEAT_INTERVAL } =
      config.get<ServerConfig>(SERVER_CONFIG);
    const HEARTBEAT_THRESHOLD = HEARTBEAT_INTERVAL * 2;
    const MISSING_HEARTBEATS = HEARTBEAT_THRESHOLD * 3;

    const ping: HeartbeatMsg<PingPong.PING> = { message: PingPong.PING };

    this.heartbeat = interval(HEARTBEAT_INTERVAL).pipe(
      mergeMap(() =>
        this.client
          .send<HeartbeatMsg<PingPong.PONG>>({ cmd: 'ping' }, ping)
          .pipe(
            timeout({ first: HEARTBEAT_THRESHOLD }),
            catchError(() => EMPTY),
          ),
      ),
      map(() => HealthStatus.HEALTHY),
      timeout({
        each: MISSING_HEARTBEATS,
        with: () => of(HealthStatus.UNHEALTHY),
      }),
      repeat(),
      distinctUntilChanged(),
    );

    this.$health = new BehaviorSubject<HealthStatus>(HealthStatus.HEALTHY);
    this.heartbeat.subscribe(this.$health);
  }

  public get health(): Observable<HealthStatus> {
    return this.$health.asObservable();
  }

  public send<TResult = any, TInput = any>(
    pattern: ReplicaProxySendPattern,
    data: TInput,
  ): Observable<TResult> {
    return concat(
      this.health.pipe(first((status) => status === HealthStatus.HEALTHY)),
      this.client.send(pattern, data),
    );
  }
}
