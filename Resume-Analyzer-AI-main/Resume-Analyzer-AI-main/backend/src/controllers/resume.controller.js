import { parseResume } from "../services/resumeParser.service.js"
import { chunkResumeText } from "../utils/sentenceChunker.js"
import { analyzeWithNLP } from "../services/nlpClient.service.js"

export const uploadResume = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "No resume uploaded" })
    }

    const parsedData = await parseResume(file.path)

      const sentences = chunkResumeText(parsedData.raw_text)

    const nlpResult = await analyzeWithNLP(sentences)

    res.json({
      success: true,
      data: {
        rawText: parsedData.raw_text,
        sentences,
        aiAnalysis: nlpResult
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Resume parsing failed" })
  }
}
