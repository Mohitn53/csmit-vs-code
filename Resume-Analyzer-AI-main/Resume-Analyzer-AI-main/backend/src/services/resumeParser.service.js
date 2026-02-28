import fs from "fs"
import { PDFParse } from "pdf-parse"
import { cleanText } from "../utils/textCleaner.js"

export const parseResume = async (filePath) => {
  const buffer = fs.readFileSync(filePath)

  // 🔥 FIX: convert Buffer → Uint8Array
  const uint8Array = new Uint8Array(buffer)

  const parser = new PDFParse(uint8Array)
  const data = await parser.getText()

  const cleanedText = cleanText(data.text)

  return {
    raw_text: cleanedText
  }
}
