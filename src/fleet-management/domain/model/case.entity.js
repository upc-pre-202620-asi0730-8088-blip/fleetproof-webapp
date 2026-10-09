export class ResolutionCase {
  #id; #reportId; #plate; #title; #severity; #status; #responsible; #dueDate; #evidence; #note;
  constructor({ id, reportId, plate = '', title = '', severity = 'medium', status = 'open', responsible = '', dueDate = '', evidence = '', note = '' } = {}) {
    this.#id = id; this.#reportId = reportId; this.#plate = plate; this.#title = title;
    this.#severity = severity; this.#status = status; this.#responsible = responsible;
    this.#dueDate = dueDate; this.#evidence = evidence; this.#note = note;
  }
  get id() { return this.#id; }
  get reportId() { return this.#reportId; }
  get plate() { return this.#plate; }
  get title() { return this.#title; }
  get severity() { return this.#severity; }
  get status() { return this.#status; }
  get responsible() { return this.#responsible; }
  get dueDate() { return this.#dueDate; }
  get evidence() { return this.#evidence; }
  get note() { return this.#note; }
}
