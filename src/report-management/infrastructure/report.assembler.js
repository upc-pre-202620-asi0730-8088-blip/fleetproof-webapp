import { Report } from '../domain/model/report.entity.js';
export class ReportAssembler {
  static toEntityFromResource(resource) { return new Report(resource); }
  static toResourceFromEntity(entity) {
    const { id, vehicleId, plate, status, requestedAt, findings, paymentStatus, serviceType } = entity;
    return { ...(id !== undefined ? { id } : {}), vehicleId, plate, status, requestedAt, findings, paymentStatus, serviceType };
  }
  static toEntitiesFromResponse(response) { return response.data.map(resource => this.toEntityFromResource(resource)); }
}
