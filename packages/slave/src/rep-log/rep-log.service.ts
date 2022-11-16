import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ServerConfig, SERVER_CONFIG } from '../config/server.config';
import { delay } from '../utils';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsg, RepLogMsgId, RepLogMsgList } from './rep-log-msg.interface';

@Injectable()
export class RepLogService {
  private readonly list: RepLogMsgList = [];
  private readonly logger = new Logger(RepLogService.name);

  constructor(private config: ConfigService) {}

  public append(dto: RepLogMsgDto): Promise<Record<'id', RepLogMsgId>> {
    const { delay: msec } = this.config.get<ServerConfig>(SERVER_CONFIG);
    return delay(msec, () => {
      const msg: RepLogMsg = { ...dto };
      this.list.push(msg);
      this.logger.debug(`Message with id ${msg.id} has been added.`);
      return { id: msg.id };
    });
  }

  public get(): RepLogMsgList {
    return this.list;
  }

  public getOne(id: RepLogMsgId): RepLogMsg {
    const msg = id > 0 ? this.list.find((msg) => msg.id === id) : undefined;
    if (!msg) {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
    return msg;
  }
}
