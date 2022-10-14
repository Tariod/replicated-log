import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ServerConfig, SERVER_CONFIG } from '../config/server.config';
import { delay } from '../utils';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsg, RepLogMsgList } from './rep-log-msg.interface';

@Injectable()
export class RepLogService {
  private readonly list: RepLogMsgList = [];
  private readonly logger = new Logger(RepLogService.name);

  constructor(private config: ConfigService) {}

  public append(dto: RepLogMsgDto): Promise<void> {
    const { delay: msec } = this.config.get<ServerConfig>(SERVER_CONFIG);
    return delay(msec, () => {
      const msg: RepLogMsg = { ...dto };
      this.list.push(msg);
      this.logger.debug('Message has been added');
    });
  }

  public get(): RepLogMsgList {
    return this.list;
  }
}
