export class Report {
  #id; #vehicleId; #plate; #status; #requestedAt; #findings;
  constructor({ id, vehicleId, plate = '', status = 'draft', requestedAt = '', findings = [] } = {}) {
    this.#id = id;
    this.#vehicleId = vehicleId;
    this.#plate = plate;
    this.#status = status;
    this.#requestedAt = requestedAt;
    this.#findings = findings.map(item => ({ ...item }));
  }
  get id() { return this.#id; }
  get vehicleId() { return this.#vehicleId; }
  get plate() { return this.#plate; }
  get status() { return this.#status; }
  get requestedAt() { return this.#requestedAt; }
  get findings() { return this.#findings.map(item => ({ ...item })); }
}
