import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from embedder import get_embeddings

with open("data/skills.json") as f:
    SKILL_PROTOTYPES = json.load(f)

skill_names = list(SKILL_PROTOTYPES.keys())
skill_texts = [ex for v in SKILL_PROTOTYPES.values() for ex in v]

skill_map = []
for skill, examples in SKILL_PROTOTYPES.items():
    for _ in examples:
        skill_map.append(skill)

skill_embeddings = get_embeddings(skill_texts)

def extract_skills(resume_sentences, threshold=0.55):
    found = {}

    sent_embeddings = get_embeddings(resume_sentences)

    for sent_emb in sent_embeddings:
        sims = cosine_similarity([sent_emb], skill_embeddings)[0]

        for idx, score in enumerate(sims):
            if score >= threshold:
                skill = skill_map[idx]
                found[skill] = max(found.get(skill, 0), float(score))

    return found
