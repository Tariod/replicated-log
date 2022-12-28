import {
  EMPTY,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  map,
  merge,
  of,
  pipe,
  raceWith,
  retry,
  share,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  PersistentLogMsg,
  PersistentLogMsgId,
  PersistentLogMsgList,
} from '../types';
import {
  ReplicaProxy,
  ReplicasPoolService,
} from '../../replicas-pool/services';
import { PersistentLogMsgDto } from '../dtos';
import { then } from '../../utils';

import { PersistentLogListService } from './persistent-log-list.service';

const RETRY_DELAY = 1000;

@Injectable()
export class PersistentLogService {
  private counter = 0;

  private readonly logger = new Logger(PersistentLogService.name);

  constructor(
    private readonly list: PersistentLogListService,
    private readonly replicasPool: ReplicasPoolService,
  ) {}

  public get(): Observable<PersistentLogMsgList> {
    return of(this.list.list());
  }

  public getOne(id: PersistentLogMsgId): Observable<PersistentLogMsg> {
    const msg =
      id > 0 ? this.list.list().find((msg) => msg.id === id) : undefined;
    return msg
      ? of(msg)
      : throwError(
          () => new NotFoundException(`Message with id ${id} not found.`),
        );
  }

  public append(
    writeConcern: number,
    dto: PersistentLogMsgDto,
  ): Observable<Record<'id', PersistentLogMsgId>> {
    const pattern = { cmd: 'append' };
    const msg: PersistentLogMsg = { id: this.counter++, ...dto };

    const replication = merge(
      ...this.replicasPool.proxies.map((proxy) =>
        proxy
          .send<Record<'id', PersistentLogMsg>>(pattern, msg)
          .pipe(map((ack) => ({ proxy, ack }))),
      ),
    );

    return replication.pipe(
      this.logReplicaAppendAck(),
      this.awaitReplicasAppendAcks(writeConcern),
      this.commitAppend(msg),
      map((msg) => ({ id: msg.id })),
    );
  }

  private awaitReplicasAppendAcks<T>(
    writeConcern: number,
  ): MonoTypeOperatorFunction<T> {
    const acks = Math.min(
      Math.max(writeConcern - 1, 0),
      this.replicasPool.proxies.length,
    );
    return pipe(
      retry({ delay: RETRY_DELAY }),
      share({
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false,
      }),
      acks > 0 ? take(acks) : raceWith(EMPTY),
    );
  }

  private commitAppend<T>(
    msg: PersistentLogMsg,
  ): OperatorFunction<T, PersistentLogMsg> {
    return pipe(
      then(msg),
      tap({ complete: () => this.list.push(msg) }),
      this.logMasterAppend(msg),
    );
  }

  private logReplicaAppendAck(): MonoTypeOperatorFunction<
    Record<'proxy', ReplicaProxy> &
      Record<'ack', Record<'id', PersistentLogMsg>>
  > {
    return tap({
      next: ({ proxy, ack }) =>
        this.logger.log(
          `Message with id ${ack.id} appending has been acknowledged from ${proxy.label}.`,
        ),
    });
  }

  private logMasterAppend(
    msg: PersistentLogMsg,
  ): MonoTypeOperatorFunction<PersistentLogMsg> {
    return tap({
      complete: () =>
        this.logger.log(`Message with id ${msg.id} has been added.`),
    });
  }
}
