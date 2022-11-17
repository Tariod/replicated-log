import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  map,
  merge,
  of,
  pipe,
  share,
  tap,
  throwError,
} from 'rxjs';

import { then } from '../utils';

import { RepLogMsg, RepLogMsgId, RepLogMsgList } from './rep-log-msg.interface';
import { REP_LOG_SLAVES } from './rep-log.constants';
import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogSlave } from './rep-log-slave.service';

@Injectable()
export class RepLogService {
  private counter = 0;
  private readonly list: RepLogMsgList = [];
  private readonly logger = new Logger(RepLogService.name);

  constructor(
    @Inject(REP_LOG_SLAVES)
    private readonly slaves: RepLogSlave[],
  ) {}

  public get(): Observable<RepLogMsgList> {
    return of(this.list);
  }

  public getOne(id: RepLogMsgId): Observable<RepLogMsg> {
    const msg = id > 0 ? this.list.find((msg) => msg.id === id) : undefined;
    return msg
      ? of(msg)
      : throwError(
          () => new NotFoundException(`Message with id ${id} not found.`),
        );
  }

  public append(dto: RepLogMsgDto): Observable<Record<'id', RepLogMsgId>> {
    const pattern = { cmd: 'append' };
    const msg: RepLogMsg = { id: ++this.counter, ...dto };

    const replication = merge(
      ...this.slaves.map((slave) =>
        slave.client
          .send<Record<'id', RepLogMsg>>(pattern, msg)
          .pipe(map((ack) => ({ slave, ack }))),
      ),
    ).pipe(
      this.logSlaveAppendAck(),
      share({
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false,
      }),
    );

    return replication.pipe(
      this.commitAppend(msg),
      map((msg) => ({ id: msg.id })),
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
    Record<'slave', RepLogSlave> & Record<'ack', Record<'id', RepLogMsg>>
  > {
    return tap({
      next: ({ slave, ack }) =>
        this.logger.debug(
          `Message with id ${ack.id} appending has been acknowledged from ${slave.label}.`,
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
