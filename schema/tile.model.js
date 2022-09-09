//
import { checkType, coerceData } from '../lib/coerce.js';
import { Field } from './field.model.js';




export class Tile {
  #categoryId = Field.define({ name: 'categoryId', type: 'number' });
  #value = Field.define({ name: 'value', type: 'number' });
  #dailyDouble = Field.define({ name: 'dailyDouble', type: 'number', nullable: true });
  #activated = Field.define({ name: 'activated', type: 'boolean' });
  #answered = Field.define({ name: 'answered', type: 'boolean' });
  #position = Field.define({ name: 'position', type: 'number' })

  #tileStates = {
    initial: () => {
      this.activated = false;
      this.answered = false;
    },
    active: () => {
      this.activated = true;
      this.answered = false;
    },
    answered: () => {
      this.activated = false;
      this.answered = true;
    },

    has(state) { return ['initial', 'active', 'answered'].includes(state) }
  }

  constructor(model) {
    this.setData(model);
  }

  validate() {
    return (
      this.categoryId && this.value &&
      !(this.activated === null || this.answered === null)
    );
  }

  setData(model) {
    this.categoryId = model.categoryId
    this.value = model.value
    this.position = model.position
    this.dailyDouble = model.dailyDouble || 0
    this.activated = model.activated
    this.answered = model.answered

    if (!this.validate()) throw new Error('Invalid tile data')

    return this;
  }

  setState(state = 'initial') {
    if (this.#tileStates.has(state)) {
      this.#tileStates[state](state)
    }
  }

  getData() {
    return {
      categoryId: this.categoryId,
      value: this.value,
      activated: this.activated,
      position: this.position,
      dailyDouble: this.dailyDouble,
      answered: this.answered,
    }
  }

  get isActivated() { return this.activated === true }

  get categoryId() { return this.#categoryId.value }

  set categoryId(v) { this.#categoryId.setValue(v); }

  get value() { return this.#value.value }

  set value(v) { this.#value.setValue(v); }

  get position() { return this.#position.value }

  set position(v) { this.#position.setValue(v); }

  get dailyDouble() { return this.#dailyDouble.value }

  set dailyDouble(v) {
    if (v) this.#dailyDouble.setValue(v)
  }

  get activated() { return this.#activated.value }

  set activated(v) {
    if (this.answered === true) return;
    this.#activated.setValue(v);
  }

  get answered() { return this.#answered.value }

  set answered(v) {
    if (v === true) this.activated = false;
    this.#answered.setValue(v);
  }
}