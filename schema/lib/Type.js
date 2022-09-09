const stockTypes = [
  ['string', String],
  ['number', Number],
  ['boolean', Boolean],
  ['null', null],
  ['undefined', undefined],
  ['promise', Promise],
  ['function', Function],
  ['array', Array],
  ['object', Object],
]

export class Type {
  #types = new Map(stockTypes)

  constructor() {}

  #type(name, type) {}

  #interface(name, definition = {}) {
    console.log('interface', {name, definition});
  }
  
  get define(){
    return {
      type: this.#type,
      interface: this.#interface,
    }
  }

  get types() { return this.#types; }
}
