const removeSpecialCharacter = (value: string) => value.replace(/\.|\&/g, "");

export const normalizeString = (value: string) =>
  removeSpecialCharacter(
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).toLocaleLowerCase();
