import { Subscription } from '../domain/model/subscription.entity.js';
export class SubscriptionAssembler {
  static toEntityFromResource(resource) { return new Subscription(resource); }
  static toResourceFromEntity(entity) { return {id: entity.id, service: entity.service, status: entity.status, paymentStatus: entity.paymentStatus}; }
}
