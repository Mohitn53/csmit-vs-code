"""
Skill Analyzer Engine
Compares user's skills against trending skill benchmarks and
produces a structured score report for LLM consumption.
"""

import re
from trending_skills import TRENDING_SKILLS, FLAT_SKILLS


# ─── Fuzzy / alias matching ────────────────────────────────────────────────────

ALIASES = {
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",
    "node": "node.js",
    "nodejs": "node.js",
    "node js": "node.js",
    "express": "express.js",
    "expressjs": "express.js",
    "express js": "express.js",
    "mongo": "mongodb",
    "mongo db": "mongodb",
    "postgres": "postgresql",
    "postgre": "postgresql",
    "psql": "postgresql",
    "tf": "tensorflow",
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "sk-learn": "scikit-learn",
    "pytorch": "pytorch",
    "langchain": "langchain",
    "hf": "hugging face",
    "huggingface": "hugging face",
    "gh": "github",
    "gha": "github actions",
    "k8s": "kubernetes",
    "kube": "kubernetes",
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "springboot": "spring boot",
    "spring-boot": "spring boot",
    "vue": "vue.js",
    "vuejs": "vue.js",
    "next": "next.js",
    "nextjs": "next.js",
    "next js": "next.js",
    "tailwind": "tailwind css",
    "tailwindcss": "tailwind css",
    "fast api": "fastapi",
    "dsa": "dsa",
    "data structures": "dsa",
    "data structures and algorithms": "dsa",
    "ml": "machine learning",
    "dl": "deep learning",
    "ai": "machine learning",
    "nlp": "nlp",
    "cv": "computer vision",
    "oop": "oop",
    "object oriented": "oop",
    "object-oriented": "oop",
    "mysql": "mysql",
    "firebase": "firebase firestore",
    "firestore": "firebase firestore",
    "chakra": "chakra ui",
}


def normalize(skill: str) -> str:
    """Lowercase, strip, resolve aliases."""
    s = skill.lower().strip()
    return ALIASES.get(s, s)


def match_skill(raw_skill: str) -> dict | None:
    """Try to match a raw skill string to our benchmark database."""
    normalized = normalize(raw_skill)

    # Exact match
    if normalized in FLAT_SKILLS:
        return FLAT_SKILLS[normalized]

    # Partial match (skill name contains or is contained in normalized)
    for key, data in FLAT_SKILLS.items():
        if normalized in key or key in normalized:
            return data

    return None


# ─── Core Analyzer ────────────────────────────────────────────────────────────

def analyze_skills(user_skills: list[str]) -> dict:
    """
    Main function. Takes a list of skill strings,
    returns a structured analysis report.
    """

    matched = []       # Skills found in benchmark
    unmatched = []     # Skills not in our DB (niche/unknown)

    for raw in user_skills:
        result = match_skill(raw)
        if result:
            matched.append({
                "user_input": raw,
                "skill": result["name"],
                "category": result["category"],
                "category_label": result["category_label"],
                "demand_score": result["demand"],
                "why_important": result["why"],
            })
        else:
            unmatched.append(raw)

    # ── Category breakdown ──────────────────────────────────────────────────
    category_scores = {}
    for item in matched:
        cat = item["category"]
        if cat not in category_scores:
            category_scores[cat] = {
                "label": item["category_label"],
                "skills": [],
                "total_demand": 0,
                "count": 0,
                "max_possible": 0,
            }
        category_scores[cat]["skills"].append(item["skill"])
        category_scores[cat]["total_demand"] += item["demand_score"]
        category_scores[cat]["count"] += 1

    # Calculate max possible demand for matched categories
    for cat_key, cat_val in category_scores.items():
        all_demands = [v["demand"] for v in TRENDING_SKILLS[cat_key]["skills"].values()]
        cat_val["max_possible"] = sum(sorted(all_demands, reverse=True)[:cat_val["count"]])
        cat_val["coverage_pct"] = round(
            (cat_val["count"] / len(TRENDING_SKILLS[cat_key]["skills"])) * 100, 1
        )
        cat_val["avg_demand"] = round(cat_val["total_demand"] / cat_val["count"], 2)

    # ── Overall score (weighted avg demand of matched skills / 10) ──────────
    if matched:
        total_demand = sum(m["demand_score"] for m in matched)
        overall_score = round((total_demand / (len(matched) * 10)) * 100, 1)
    else:
        overall_score = 0

    # ── Strength analysis ───────────────────────────────────────────────────
    strong_skills = [m for m in matched if m["demand_score"] >= 8.5]
    moderate_skills = [m for m in matched if 7.0 <= m["demand_score"] < 8.5]
    weak_skills = [m for m in matched if m["demand_score"] < 7.0]

    # ── Gap analysis: find top missing skills per category ──────────────────
    user_skill_names = {m["skill"].lower() for m in matched}
    gaps = {}

    for cat_key, cat_data in TRENDING_SKILLS.items():
        missing_in_cat = []
        for skill_name, meta in cat_data["skills"].items():
            if skill_name.lower() not in user_skill_names:
                missing_in_cat.append({
                    "skill": skill_name,
                    "demand_score": meta["demand"],
                    "why": meta["why"],
                })
        # Sort by demand, take top 3
        missing_in_cat.sort(key=lambda x: x["demand_score"], reverse=True)
        if missing_in_cat:
            gaps[cat_key] = {
                "label": cat_data["label"],
                "top_missing": missing_in_cat[:3],
            }

    # ── Priority recommendations ────────────────────────────────────────────
    # High-value skills user is completely missing from high-demand categories
    all_missing_flat = []
    for cat_key, gap_data in gaps.items():
        for skill in gap_data["top_missing"]:
            all_missing_flat.append({**skill, "category": cat_key, "category_label": gap_data["label"]})

    all_missing_flat.sort(key=lambda x: x["demand_score"], reverse=True)
    top_recommendations = all_missing_flat[:5]

    # ── Profile type detection ──────────────────────────────────────────────
    profile_type = _detect_profile(category_scores)

    # ── Final structured report ─────────────────────────────────────────────
    return {
        "summary": {
            "overall_score": overall_score,
            "total_skills_provided": len(user_skills),
            "skills_recognized": len(matched),
            "skills_unrecognized": len(unmatched),
            "profile_type": profile_type,
        },
        "strengths": {
            "strong_skills": [
                {"skill": m["skill"], "demand_score": m["demand_score"], "why": m["why_important"]}
                for m in strong_skills
            ],
            "moderate_skills": [
                {"skill": m["skill"], "demand_score": m["demand_score"]}
                for m in moderate_skills
            ],
            "categories_covered": list(category_scores.keys()),
        },
        "category_breakdown": {
            cat: {
                "label": data["label"],
                "skills_you_have": data["skills"],
                "avg_demand_of_your_skills": data["avg_demand"],
                "category_coverage_percent": data["coverage_pct"],
            }
            for cat, data in category_scores.items()
        },
        "gaps": {
            cat: {
                "label": data["label"],
                "top_missing_skills": data["top_missing"],
            }
            for cat, data in gaps.items()
            if cat in category_scores  # Only show gaps in categories user is already in
        },
        "top_recommendations": top_recommendations,
        "unrecognized_skills": unmatched,
        "raw_matched": matched,
    }


def _detect_profile(category_scores: dict) -> str:
    """Heuristically detect what kind of developer the user is."""
    cats = set(category_scores.keys())

    has_frontend = "frontend" in cats
    has_backend = "backend" in cats
    has_ai = "ai_ml" in cats
    has_devops = "devops_cloud" in cats
    has_db = "database" in cats

    if has_ai and (has_frontend or has_backend):
        return "AI/ML Full-Stack Developer"
    if has_ai:
        return "AI/ML & Data Science Engineer"
    if has_frontend and has_backend and has_db:
        return "Full-Stack Developer"
    if has_frontend and has_backend:
        return "Full-Stack Developer"
    if has_frontend:
        return "Frontend Developer"
    if has_backend and has_devops:
        return "Backend / DevOps Engineer"
    if has_backend:
        return "Backend Developer"
    if has_devops:
        return "DevOps / Cloud Engineer"
    if "dsa_cs" in cats:
        return "CS Fundamentals Focused"

    return "General Developer"


# ── Prompt builder for LLM ─────────────────────────────────────────────────────

def build_llm_prompt(analysis: dict) -> str:
    """
    Converts the structured analysis into a rich prompt
    that an LLM can use to generate a human-friendly report.
    """
    s = analysis["summary"]
    st = analysis["strengths"]
    gaps = analysis["gaps"]
    recs = analysis["top_recommendations"]

    strong_list = ", ".join([x["skill"] for x in st["strong_skills"]]) or "None identified"
    moderate_list = ", ".join([x["skill"] for x in st["moderate_skills"]]) or "None"
    gap_lines = []
    for cat, data in gaps.items():
        missing = ", ".join([x["skill"] for x in data["top_missing_skills"]])
        gap_lines.append(f"  - {data['label']}: missing {missing}")
    gap_text = "\n".join(gap_lines) or "  No major gaps in current categories."

    rec_lines = []
    for r in recs:
        rec_lines.append(
            f"  - {r['skill']} (demand: {r['demand_score']}/10): {r['why']}"
        )
    rec_text = "\n".join(rec_lines)

    cat_lines = []
    for cat, data in analysis["category_breakdown"].items():
        cat_lines.append(
            f"  - {data['label']}: {', '.join(data['skills_you_have'])} "
            f"(avg demand: {data['avg_demand_of_your_skills']}/10, "
            f"covers {data['category_coverage_percent']}% of category)"
        )
    cat_text = "\n".join(cat_lines)

    prompt = f"""You are a senior tech career advisor. Analyze this developer's skill profile and give them a personalized, honest, and motivating career report.

=== SKILL ANALYSIS DATA ===

OVERALL SCORE: {s['overall_score']}/100
PROFILE TYPE: {s['profile_type']}
SKILLS RECOGNIZED: {s['skills_recognized']} out of {s['total_skills_provided']} provided

CATEGORY BREAKDOWN:
{cat_text}

STRONG SKILLS (demand ≥ 8.5/10):
{strong_list}

MODERATE SKILLS (7.0–8.5/10):
{moderate_list}

SKILL GAPS (in your current focus areas):
{gap_text}

TOP 5 RECOMMENDED SKILLS TO LEARN NEXT:
{rec_text}

UNRECOGNIZED/NICHE SKILLS: {', '.join(analysis['unrecognized_skills']) or 'None'}

=== YOUR TASK ===

Write a structured career report with these exact sections:

1. **Profile Summary** — Who this developer is, what they're building toward, their overall score and what it means (2-3 sentences, conversational and honest)

2. **What You're Great At** — Highlight their strongest skills, explain WHY these skills matter in the current job market, and how they position the developer (be specific, mention demand scores)

3. **What You're Missing** — Be direct but encouraging. Explain the gaps in their current focus areas and why these missing skills hurt them in the job market or interviews

4. **Your Learning Roadmap** — Give a prioritized, actionable 3-step learning plan based on the top recommendations. For each skill, explain WHY it's worth learning RIGHT NOW

5. **Career Outlook** — Based on their profile type and current skills, what roles they can realistically target now, and what they could target after 3-6 months of focused learning

Keep the tone honest, direct, and motivating — like a mentor who genuinely wants them to succeed. Use specific numbers from the data. Avoid generic advice."""

    return prompt