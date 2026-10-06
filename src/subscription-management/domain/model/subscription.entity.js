export class Subscription {
  #id; #service; #status; #paymentStatus;
  constructor({id, service = 'monitoring', status = 'pending', paymentStatus = 'pending'} = {}) {
    if (!['monitoring', 'fleet'].includes(service)) throw new Error('Invalid service');
    this.#id = id; this.#service = service; this.#status = status; this.#paymentStatus = paymentStatus;
  }
  get id() { return this.#id; }
  get service() { return this.#service; }
  get status() { return this.#status; }
  get paymentStatus() { return this.#paymentStatus; }
}
