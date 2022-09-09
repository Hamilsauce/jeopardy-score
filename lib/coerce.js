const typeCheck = (regex, data) => regex.test(data)
const booleanCheck = (data) => typeCheck(/false|true/, data)
const numberCheck = (data) => typeCheck(/^(\d+(\.\d+)?)$/, data)
const stringCheck = (data) => typeof value === 'string'

const dateValueCheck = (value) => {
  const isStringOrNumber = typeof value === 'string' || typeof value === 'number' ? true : false;
  const canBeParsed = !isNaN(Date.parse(value)) ? true : false;
  return isStringOrNumber && canBeParsed //? true : false;
}

const objectCheck = (value) => {
  return typeof value === 'object' && !Array.isArray(value)
}

const createDateFromValue = (dateValue = null) => {
  if (dateValue === null || !this.dateValueCheck(dateValue)) return;
  return new Date(Date.parse(dateValue));
}

export const checkType  = {
  
  string: stringCheck,
  boolean: booleanCheck,
  number: numberCheck,
  object: objectCheck,
  date: dateValueCheck,
}
//   if (booleanCheck(d)) return d === 'true' ? true : false;
//   else if (numberCheck(d)) return +d
//   else if (dateValueCheck(d)) return createDateFromValue(d)
//   // else if (objectCheck(JSON.parse(d))) return JSON.parse(d)
//   else return d
// }

export const coerceData = (d) => {
  if (booleanCheck(d)) return d === 'true' ? true : false;
  else if (numberCheck(d)) return +d
  else if (dateValueCheck(d)) return createDateFromValue(d)
  // else if (objectCheck(JSON.parse(d))) return JSON.parse(d)
  else return d
}
