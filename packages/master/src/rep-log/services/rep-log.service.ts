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
  share,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { RepLogMsg, RepLogMsgId, RepLogMsgList } from '../types';
import {
  ReplicaProxy,
  ReplicasPoolService,
} from '../../replicas-pool/services';
import { RepLogMsgDto } from '../dtos';
import { then } from '../../utils';

import { RepLogListService } from './rep-log-list.service';

@Injectable()
export class RepLogService {
  private counter = 0;

  private readonly logger = new Logger(RepLogService.name);

  constructor(
    private readonly list: RepLogListService,
    private readonly replicasPool: ReplicasPoolService,
  ) {}

  public get(): Observable<RepLogMsgList> {
    return of(this.list.list());
  }

  public getOne(id: RepLogMsgId): Observable<RepLogMsg> {
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
    dto: RepLogMsgDto,
  ): Observable<Record<'id', RepLogMsgId>> {
    const pattern = { cmd: 'append' };
    const msg: RepLogMsg = { id: this.counter++, ...dto };

    const replication = merge(
      ...this.replicasPool.proxies.map((proxy) =>
        proxy
          .send<Record<'id', RepLogMsg>>(pattern, msg)
          .pipe(map((ack) => ({ proxy, ack }))),
      ),
    );

    return replication.pipe(
      this.logSlaveAppendAck(),
      this.awaitSlavesAppendAcks(writeConcern),
      this.commitAppend(msg),
      map((msg) => ({ id: msg.id })),
    );
  }

  private awaitSlavesAppendAcks<T>(
    writeConcern: number,
  ): MonoTypeOperatorFunction<T> {
    const acks = Math.min(
      Math.max(writeConcern - 1, 0),
      this.replicasPool.proxies.length,
    );
    return pipe(
      share({
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false,
      }),
      acks > 0 ? take(acks) : raceWith(EMPTY),
    );
  }

  private commitAppend<T>(msg: RepLogMsg): OperatorFunction<T, RepLogMsg> {
    return pipe(
      then(msg),
      tap({ complete: () => this.list.push(msg) }),
      this.logMasterAppend(msg),
    );
  }

  private logSlaveAppendAck(): MonoTypeOperatorFunction<
    Record<'proxy', ReplicaProxy> & Record<'ack', Record<'id', RepLogMsg>>
  > {
    return tap({
      next: ({ proxy, ack }) =>
        this.logger.debug(
          `Message with id ${ack.id} appending has been acknowledged from ${proxy.label}.`,
        ),
    });
  }

  private logMasterAppend(msg: RepLogMsg): MonoTypeOperatorFunction<RepLogMsg> {
    return tap({
      complete: () =>
        this.logger.debug(`Message with id ${msg.id} has been added.`),
    });
  }
}
