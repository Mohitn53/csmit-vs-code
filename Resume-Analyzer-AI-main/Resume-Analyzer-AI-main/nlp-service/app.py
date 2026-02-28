from fastapi import FastAPI
from pydantic import BaseModel
from skill_matcher import extract_skills
from section_classifier import classify_sentence

app = FastAPI()

class ResumeInput(BaseModel):
    sentences: list[str]

@app.post("/analyze")
def analyze_resume(data: ResumeInput):
    skills = extract_skills(data.sentences)

    sections = {}
    for s in data.sentences:
        section = classify_sentence(s)
        sections.setdefault(section, []).append(s)

    return {
        "skills": skills,
        "sections": sections
    }
