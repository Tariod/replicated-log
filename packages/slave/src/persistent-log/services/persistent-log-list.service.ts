import { Injectable } from '@nestjs/common';

import { OrderedLinkedList } from '../../utils';
import { PersistentLogMsg } from '../types';

@Injectable()
export class PersistentLogListService extends OrderedLinkedList<PersistentLogMsg> {
  protected compareBackward(
    a: PersistentLogMsg,
    b: PersistentLogMsg,
  ): -1 | 0 | 1 {
    if (a.id < b.id) return -1;
    else if (a.id === b.id) return 0;
    else if (a.id > b.id) return 1;
  }

  protected compareForwardFirst(a: PersistentLogMsg): boolean {
    return a.id === 0;
  }

  protected compareForward(a: PersistentLogMsg, b: PersistentLogMsg): boolean {
    return a.id === b.id - 1;
  }
}
