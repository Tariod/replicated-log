import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, merge, of, tap, map, throwError } from 'rxjs';

import { then } from '../utils';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsg, RepLogMsgId, RepLogMsgList } from './rep-log-msg.interface';
import { REP_LOG_SLAVE_CLIENTS } from './rep-log.constants';

@Injectable()
export class RepLogService {
  private counter = 0;
  private readonly list: RepLogMsgList = [];
  private readonly logger = new Logger(RepLogService.name);

  constructor(
    @Inject(REP_LOG_SLAVE_CLIENTS)
    private readonly slaves: ClientProxy[],
  ) {}

  public append(dto: RepLogMsgDto): Observable<Record<'id', RepLogMsgId>> {
    const pattern = { cmd: 'append' };
    const msg: RepLogMsg = { id: ++this.counter, ...dto };

    const slaves = merge(
      ...this.slaves.map((slave) =>
        slave.send<Record<'id', RepLogMsgId>>(pattern, msg),
      ),
    );

    return slaves.pipe(
      then(msg),
      tap({
        complete: () => {
          this.list.push(msg);
          this.logger.debug(`Message with id ${msg.id} has been added.`);
        },
      }),
      map((msg) => ({ id: msg.id })),
    );
  }

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
}
