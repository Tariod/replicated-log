import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, merge, of, tap } from 'rxjs';

import { then } from '../utils';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsg, RepLogMsgList } from './rep-log-msg.interface';
import { REP_LOG_SLAVE_CLIENTS } from './rep-log.constants';

@Injectable()
export class RepLogService {
  private list: RepLogMsgList = [];

  constructor(
    @Inject(REP_LOG_SLAVE_CLIENTS)
    private readonly slaves: ClientProxy[],
  ) {}

  public append(dto: RepLogMsgDto): Observable<RepLogMsg> {
    const pattern = { cmd: 'append' };
    const msg: RepLogMsg = { ...dto };

    const slaves = merge(
      ...this.slaves.map((slave) => slave.send(pattern, dto)),
    );

    return slaves.pipe(then(msg), tap({ complete: () => this.list.push(msg) }));
  }

  public get(): Observable<RepLogMsgList> {
    return of(this.list);
  }
}
