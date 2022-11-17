import { Injectable } from '@nestjs/common';

import { OrderedLinkedList } from '../utils';

import { RepLogMsg } from './rep-log-msg.interface';

@Injectable()
export class RepLogListService extends OrderedLinkedList<RepLogMsg> {
  protected compareBackward(a: RepLogMsg, b: RepLogMsg): -1 | 0 | 1 {
    if (a.id < b.id) return -1;
    else if (a.id === b.id) return 0;
    else if (a.id > b.id) return 1;
  }

  protected compareForwardFirst(a: RepLogMsg): boolean {
    return a.id === 0;
  }

  protected compareForward(a: RepLogMsg, b: RepLogMsg): boolean {
    return a.id === b.id - 1;
  }
}
