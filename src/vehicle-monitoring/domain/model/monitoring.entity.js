export class VehicleMonitoring {
  #id; #vehicleId; #intervalMinutes; #status; #snapshot; #lastCheckedAt; #nextCheckAt;
  constructor({id, vehicleId, intervalMinutes = 60, status = 'active', snapshot = {}, lastCheckedAt = '', nextCheckAt = ''} = {}) {
    if (vehicleId === undefined || !Number.isInteger(intervalMinutes) || intervalMinutes < 1) throw new Error('Invalid monitoring schedule');
    this.#id=id; this.#vehicleId=vehicleId; this.#intervalMinutes=intervalMinutes; this.#status=status;
    this.#snapshot={...snapshot}; this.#lastCheckedAt=lastCheckedAt; this.#nextCheckAt=nextCheckAt;
  }
  get id(){return this.#id;} get vehicleId(){return this.#vehicleId;} get intervalMinutes(){return this.#intervalMinutes;}
  get status(){return this.#status;} get snapshot(){return {...this.#snapshot};} get lastCheckedAt(){return this.#lastCheckedAt;} get nextCheckAt(){return this.#nextCheckAt;}
}
export class MonitoringAlert {
  #id; #monitoringId; #vehicleId; #changes; #createdAt;
  constructor({id, monitoringId, vehicleId, changes = [], createdAt = new Date().toISOString()} = {}) {
    this.#id=id; this.#monitoringId=monitoringId; this.#vehicleId=vehicleId; this.#changes=changes.map(c=>({...c})); this.#createdAt=createdAt;
  }
  get id(){return this.#id;} get monitoringId(){return this.#monitoringId;} get vehicleId(){return this.#vehicleId;} get changes(){return this.#changes.map(c=>({...c}));} get createdAt(){return this.#createdAt;}
}
