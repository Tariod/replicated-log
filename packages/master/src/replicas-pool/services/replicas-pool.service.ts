import { Inject, Injectable } from '@nestjs/common';
import { Observable, first, map, zip } from 'rxjs';

import { HealthStatus, ReplicaProxyHealthStatus } from '../types';
import { REPLICAS_POOL_PROXIES } from '../replicas-pool.constants';

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

  public quorum(): Observable<boolean> {
    return this.health().pipe(
      map((statuses) => {
        const healthyProxies = statuses.reduce(
          (counter, status) =>
            status.status === HealthStatus.HEALTHY ? counter + 1 : counter,
          0,
        );
        return healthyProxies >= statuses.length / 2;
      }),
    );
  }
}
