import { VehicleMonitoring, MonitoringAlert } from '../domain/model/monitoring.entity.js';
export class MonitoringAssembler {
  static toEntityFromResource(r){return new VehicleMonitoring(r);}
  static toResourceFromEntity(e){return {id:e.id, vehicleId:e.vehicleId, intervalMinutes:e.intervalMinutes, status:e.status, snapshot:e.snapshot, lastCheckedAt:e.lastCheckedAt, nextCheckAt:e.nextCheckAt};}
}
export class AlertAssembler {
  static toEntityFromResource(r){return new MonitoringAlert(r);}
  static toResourceFromEntity(e){return {id:e.id, monitoringId:e.monitoringId, vehicleId:e.vehicleId, changes:e.changes, createdAt:e.createdAt};}
}
