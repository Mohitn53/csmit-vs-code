import axios from "axios"

const NLP_BASE_URL = "http://localhost:8000"

export const analyzeWithNLP = async (sentences) => {
  const response = await axios.post(`${NLP_BASE_URL}/analyze`, {
    sentences
  })

  return response.data
}
