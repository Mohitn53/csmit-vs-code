export const chunkResumeText = (text) => {
  return text
    .split(/\n|•|-|\./)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300)
}
