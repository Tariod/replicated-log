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
  tap,
  timeout,
} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

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

  private readonly logger = new Logger(ReplicaProxy.name);

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
          // Under the hood, NestJS, for each sent message over ClientProxy,
          // adds an identifier with its response observable to the map.
          // So we don't need to provide id for heartbeats.
          .send<HeartbeatMsg<PingPong.PONG>>({ cmd: 'ping' }, ping)
          .pipe(
            tap(() =>
              this.logger.debug(
                `Message ${ping.message} sent to ${this.label}.`,
              ),
            ),
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
      tap((status) =>
        this.logger.log(
          `The status of ${this.label} has changed to ${status}.`,
        ),
      ),
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
