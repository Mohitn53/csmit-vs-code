export const cleanText = (text) => {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
}
