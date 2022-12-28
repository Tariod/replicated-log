import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ReplicaProxyHealthStatus } from '../types';
import { ReplicasPoolService } from '../services';

@Controller('/health')
export class ReplicasPoolController {
  constructor(private readonly ReplicasPool: ReplicasPoolService) {}

  @Get()
  public get(): Observable<ReplicaProxyHealthStatus[]> {
    return this.ReplicasPool.health();
  }
}
