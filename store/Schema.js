const SchemaOptions = {
  primaryKey: null || '',
  autoIndex: true,
  collectionName: null,
  timestamps: false,
}

const SchemaFieldOptions = { _id: false, autoIndex: false }

export class Schematic {
  constructor(definitionObject = {}) {
    if (!definitionObject || !definitionObject.fields) throw new Error('definitionObject passed to schema requires fields')

    this.collectionName = definitionObject.collectionName || null;
    this.fields = definitionObject.fields || {};
  };
}


export class JsonMap extends Map {
  constructor(entries) {
    super(entries);

    if (Array.isArray(entries))
      entries.forEach(([key, value]) => {
        super.set(value, key)
      });
  }

  set(key, value) {
    super.set(key, value);
    super.set(value, key);

    return this;
  }

  toJSON() {
    return [...this.entries()]
  }
};


const jsonMap = new JsonMap([['suk', 'me']])


console.log('jsonMap', [...jsonMap.entries()])
// console.log('JSON.stringify(jsonMap', JSON.stringify(jsonMap))


export class Schema extends Map {
  #name = null;
  #fields = new Map();
  #options = {};

  constructor(name, schematic = {}) {
    if (!name || !schematic) throw new Error('Schema missing name or definition.')

    super(Object.entries(schematic));


  }

  validateField(name, value) {

  }

  validate(record = {}) {
    return [...this.#fields].every(([fieldName, def]) => record[fieldName])
  }

  getFieldDefinition(fieldName = '') {
    if (this.has(fieldName)) return this.#fields.get(fieldName)
  }

  has(fieldName = '') {
    return this.#fields.has(fieldName)
  }

  add({ fieldName, definitionObject }) {
    this.#fields.set(fieldName, { ...definitionObject })
    return this;
  }

  remove(fieldName = '') {
    this.#fields.delete(fieldName)
    return this;
  }

  get prop() { return this._prop };

  set prop(newValue) { this._prop = newValue };
}





const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);





// export class SchemaBackup {
//   #collectionName = null;
//   #fields = new Map();
//   #options = {};

//   constructor(name, schematic = {}, schemaOptions = SchemaOptions) {
//     if (!schematic || !schematic.fields) throw new Error('schematic passed to schema requires fields')

//   }

//   validate(record = {}) {
//     return [...this.#fields].every(([fieldName, def]) => record[fieldName])
//   }

//   getFieldDefinition(fieldName = '') {
//     if (this.has(fieldName)) return this.#fields.get(fieldName)
//   }

//   has(fieldName = '') {
//     return this.#fields.has(fieldName)
//   }

//   add({ fieldName, definitionObject }) {
//     this.#fields.set(fieldName, { ...definitionObject })
//     return this;
//   }

//   remove(fieldName = '') {
//     this.#fields.delete(fieldName)
//     return this;
//   }

//   get prop() { return this._prop };

//   set prop(newValue) { this._prop = newValue };
// }