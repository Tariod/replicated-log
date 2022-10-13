import { Injectable } from '@nestjs/common';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsg, RepLogMsgList } from './rep-log-msg.interface';

@Injectable()
export class RepLogService {
  private list: RepLogMsgList = [];

  public async append(dto: RepLogMsgDto): Promise<void> {
    const msg: RepLogMsg = { ...dto };
    this.list.push(msg);
  }
}
