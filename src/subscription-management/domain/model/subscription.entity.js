export class Subscription {
  #id; #service; #status; #paymentStatus; #plan;
  constructor({id, service = 'monitoring', status = 'pending', paymentStatus = 'pending', plan = 'monthly'} = {}) {
    if (!['monitoring', 'fleet'].includes(service)) throw new Error('Invalid service');
    this.#id = id; this.#service = service; this.#status = status; this.#paymentStatus = paymentStatus;
    if (!['weekly','monthly'].includes(plan)) throw new Error('Invalid plan');
    this.#plan = plan;
  }
  get id() { return this.#id; }
  get service() { return this.#service; }
  get status() { return this.#status; }
  get paymentStatus() { return this.#paymentStatus; }
  get plan() { return this.#plan; }
}
