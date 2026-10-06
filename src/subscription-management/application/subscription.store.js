import { defineStore } from 'pinia';
import { shallowRef, ref } from 'vue';
import { Subscription } from '../domain/model/subscription.entity.js';
import { SubscriptionAssembler as Assembler } from '../infrastructure/subscription.assembler.js';
import { SubscriptionApi } from '../infrastructure/subscription-api.js';
const api = new SubscriptionApi();
export const useSubscriptionStore = defineStore('subscriptions', () => {
  const subscriptions = shallowRef([]), error = ref('');
  async function fetchSubscriptions() {
    error.value = '';
    try { subscriptions.value = (await api.getAll()).data.map(Assembler.toEntityFromResource); }
    catch { error.value = 'errors.load'; }
  }
  function isActive(service) { return subscriptions.value.some(s => s.service === service && s.status === 'active' && s.paymentStatus === 'completed'); }
  async function save(subscription) {
    const saved = Assembler.toEntityFromResource((await api.save(Assembler.toResourceFromEntity(subscription))).data);
    subscriptions.value = [...subscriptions.value.filter(s => s.id !== saved.id), saved]; return saved;
  }
  async function request(service) {
    if (subscriptions.value.some(s => s.service === service && s.status !== 'cancelled')) return;
    await save(new Subscription({service}));
  }
  async function simulatePayment(id, success) {
    const current = subscriptions.value.find(s => s.id === id);
    if (!current || current.status === 'active') return;
    await save(new Subscription({...Assembler.toResourceFromEntity(current), paymentStatus: success ? 'completed' : 'failed', status: success ? 'active' : 'pending'}));
  }
  return {subscriptions, error, fetchSubscriptions, isActive, request, simulatePayment};
});
