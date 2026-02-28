import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from embedder import get_embeddings

with open("data/sections.json") as f:
    SECTION_EXAMPLES = json.load(f)

section_labels = list(SECTION_EXAMPLES.keys())
section_texts = [" ".join(v) for v in SECTION_EXAMPLES.values()]
section_embeddings = get_embeddings(section_texts)

def classify_sentence(sentence):
    emb = get_embeddings([sentence])[0]
    sims = cosine_similarity([emb], section_embeddings)[0]
    return section_labels[int(np.argmax(sims))]
