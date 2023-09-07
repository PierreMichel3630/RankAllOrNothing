export const isAllPropertiesFalse = (obj: Object) =>
  Object.values(obj).every((v) => v === false);

export const isAllPropertiesTrue = (obj: Object) =>
  Object.values(obj).every((v) => v === true);

export const getPropertiesTrue = (obj: Object) =>
  Object.values(obj).every((v) => v === true);
