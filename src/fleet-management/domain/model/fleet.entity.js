export class Fleet {
  #id; #name;
  constructor({id, name = ''} = {}) { if (!name.trim()) throw new Error('Fleet name required'); this.#id = id; this.#name = name.trim(); }
  get id() { return this.#id; }
  get name() { return this.#name; }
}
export class FleetVehicleAssignment {
  #id; #fleetId; #vehicleId; #responsible;
  constructor({id, fleetId, vehicleId, responsible = ''} = {}) {
    if (fleetId === undefined || vehicleId === undefined || !responsible.trim()) throw new Error('Assignment required');
    this.#id = id; this.#fleetId = fleetId; this.#vehicleId = vehicleId; this.#responsible = responsible.trim();
  }
  get id() { return this.#id; } get fleetId() { return this.#fleetId; }
  get vehicleId() { return this.#vehicleId; } get responsible() { return this.#responsible; }
}
