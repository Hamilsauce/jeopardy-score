import { checkType, coerceData } from '../lib/coerce.js';

export class Field {
  #key = null;
  #type = null;
  #nullable = null;
  #value = null;

  constructor(key = 'none', type = String, nullable = false, initialValue = null) {
    this.#key = key;
    this.nullable = nullable;
    this.setType(type);

    if (initialValue) this.setValue(value);

    this.isValidType = (value) => checkType[this.type](value) || (this.nullable && value === null)
  }

  static define({ key, type, nullable, value }) {
    const f = new Field(key, type, nullable || false);
    if (value) return f.setValue(value)

    return f;
  }

  get key() { return this.#key }

  get type() { return this.#type }

  get value() { return this.#value }

  validate(v) { return this.isValidType(v) }

  setkey(v) {
    if (v && typeof v === 'string') {
      this.#key = v;

      return this;
    }

    else console.error(`JEOTILE: Invalid value passed to ${this.key}.setValue. Value: ${v}`)

    return this;
  }

  setValue(v) {
    if (this.validate(v)) {
      this.#value = v;

      return this;
    }
    
    else console.error(`JEOTILE: Invalid value passed to ${this.key}.setValue. Value: ${v}`)

    return this;
  }

  setType(v) {
    this.#type = (v || 'string').toLowerCase();

    return this;
  }
}
