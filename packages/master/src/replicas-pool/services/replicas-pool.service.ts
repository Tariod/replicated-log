import { Inject, Injectable } from '@nestjs/common';
import { Observable, first, map, zip } from 'rxjs';

import { REPLICAS_POOL_PROXIES } from '../replicas-pool.constants';
import { ReplicaProxyHealthStatus } from '../types';

import { ReplicaProxy } from './replica-proxy';

@Injectable()
export class ReplicasPoolService {
  constructor(
    @Inject(REPLICAS_POOL_PROXIES)
    public readonly proxies: ReplicaProxy[],
  ) {}

  public health(): Observable<ReplicaProxyHealthStatus[]> {
    const labels = this.proxies.map((proxy) => proxy.label);
    return zip(this.proxies.map((proxy) => proxy.health)).pipe(
      map((statuses) =>
        statuses.map((status, index) => ({ label: labels[index], status })),
      ),
      first(),
    );
  }
}
