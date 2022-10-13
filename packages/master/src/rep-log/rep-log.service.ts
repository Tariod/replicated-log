import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, finalize, merge, of } from 'rxjs';

import { then } from '../utils';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsgList } from './rep-log-msg.interface';
import { REP_LOG_SLAVE_CLIENTS } from './rep-log.constants';

@Injectable()
export class RepLogService {
  private list: RepLogMsgList = [];

  constructor(
    @Inject(REP_LOG_SLAVE_CLIENTS)
    private readonly slaves: ClientProxy[],
  ) {}

  public append(dto: RepLogMsgDto): Observable<void> {
    const pattern = { cmd: 'append' };
    const msg = { ...dto };

    const slaves = merge(
      ...this.slaves.map((slave) => slave.send(pattern, dto)),
    );

    return slaves.pipe(
      then(),
      finalize(() => this.list.push(msg)),
    );
  }

  public get(): Observable<RepLogMsgList> {
    return of(this.list);
  }
}
