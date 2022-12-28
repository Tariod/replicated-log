export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  UNHEALTHY = 'UNHEALTHY',
}

export type ReplicaProxyHealthStatus = {
  label: string;
  status: HealthStatus;
};
