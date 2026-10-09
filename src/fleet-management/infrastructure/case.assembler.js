import { ResolutionCase } from '../domain/model/case.entity.js';
export class CaseAssembler {
  static toEntityFromResource(resource) { return new ResolutionCase(resource); }
  static toResourceFromEntity(entity) {
    const { id, reportId, plate, title, severity, status, responsible, dueDate, evidence, note } = entity;
    return { ...(id !== undefined ? { id } : {}), ...(reportId !== undefined ? { reportId } : {}), plate, title, severity, status, responsible, dueDate, evidence, note };
  }
  static toEntitiesFromResponse(response) { return response.data.map(resource => this.toEntityFromResource(resource)); }
}
