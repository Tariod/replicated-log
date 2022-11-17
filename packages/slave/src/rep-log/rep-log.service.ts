import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SERVER_CONFIG, ServerConfig } from '../config/server.config';
import { delay } from '../utils';

import { RepLogMsg, RepLogMsgId, RepLogMsgList } from './rep-log-msg.interface';
import { RepLogListService } from './rep-log-list.service';
import { RepLogMsgDto } from './rep-log-msg.dto';

@Injectable()
export class RepLogService {
  private delay = 0;

  private readonly logger = new Logger(RepLogService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly list: RepLogListService,
  ) {}

  public append(dto: RepLogMsgDto): Promise<Record<'id', RepLogMsgId>> {
    const { delays } = this.config.get<ServerConfig>(SERVER_CONFIG);
    return delay(delays[this.delay++ % delays.length], () => {
      const msg: RepLogMsg = { ...dto };
      this.list.push(msg);
      this.logger.debug(`Message with id ${msg.id} has been added.`);
      return { id: msg.id };
    });
  }

  public get(): RepLogMsgList {
    return this.list.list();
  }

  public getOne(id: RepLogMsgId): RepLogMsg {
    const msg =
      id > 0 ? this.list.list().find((msg) => msg.id === id) : undefined;
    if (!msg) {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
    return msg;
  }
}
