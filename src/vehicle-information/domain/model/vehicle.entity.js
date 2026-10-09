export class Vehicle {
    #id; #plate; #type; #site; #owner; #risk; #monitored;
    constructor({ id, plate = '', type = '', site = '', owner = '', risk = 'low', monitored = false } = {}) {
        this.#id = id;
        this.#plate = plate.trim().toUpperCase();
        this.#type = type;
        this.#site = site;
        this.#owner = owner;
        this.#risk = risk;
        this.#monitored = monitored;
    }
    get id() { return this.#id; }
    get plate() { return this.#plate; }
    get type() { return this.#type; }
    get site() { return this.#site; }
    get owner() { return this.#owner; }
    get risk() { return this.#risk; }
    get monitored() { return this.#monitored; }
}
