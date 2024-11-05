export interface GeneralObject {
  [index: string]: string | number | boolean | GeneralObject;
}
export const defaultSettings = {
  "editor.fontFamily": "JetBrains Mono",
  "editor.fontLigatures": true,
  // active warns module js file
  "javascript.validate.enable": false,
}
