export class Report {
  #id; #vehicleId; #plate; #status; #requestedAt; #findings; #paymentStatus; #serviceType;
  constructor({ id, vehicleId, plate = '', status = 'draft', requestedAt = '', findings = [], paymentStatus = 'none', serviceType = 'fleet' } = {}) {
    this.#id = id;
    this.#vehicleId = vehicleId;
    this.#plate = plate;
    this.#status = status;
    this.#requestedAt = requestedAt;
    this.#findings = findings.map(item => ({ ...item }));
    this.#paymentStatus = paymentStatus; this.#serviceType = serviceType;
  }
  get id() { return this.#id; }
  get vehicleId() { return this.#vehicleId; }
  get plate() { return this.#plate; }
  get status() { return this.#status; }
  get requestedAt() { return this.#requestedAt; }
  get findings() { return this.#findings.map(item => ({ ...item })); }
  get paymentStatus() { return this.#paymentStatus; }
  get serviceType() { return this.#serviceType; }
}
