"""
Trending skills benchmark data.
Each category has skills with a "demand_score" (1-10) representing
how in-demand that skill currently is in the job market.
"""

TRENDING_SKILLS = {
    "frontend": {
        "label": "Frontend Development",
        "skills": {
            "React": {"demand": 9.5, "why": "Most popular UI library, used by Facebook, Netflix, Airbnb"},
            "Next.js": {"demand": 9.2, "why": "Industry standard for production React apps with SSR/SSG"},
            "TypeScript": {"demand": 9.4, "why": "Mandatory in most senior roles, prevents runtime bugs"},
            "Tailwind CSS": {"demand": 8.8, "why": "Fastest growing CSS framework, loved by startups and enterprises"},
            "Vue.js": {"demand": 7.5, "why": "Popular in Asia and Europe, good alternative to React"},
            "Svelte": {"demand": 7.0, "why": "Growing rapidly, known for performance and simplicity"},
            "JavaScript": {"demand": 9.8, "why": "Foundational web skill, non-negotiable for any web developer"},
            "HTML": {"demand": 8.0, "why": "Core web skill, required for every frontend role"},
            "CSS": {"demand": 8.0, "why": "Core web skill, required for every frontend role"},
            "Redux": {"demand": 7.2, "why": "Still widely used in large React apps for state management"},
            "Zustand": {"demand": 7.8, "why": "Modern lightweight alternative to Redux, rising fast"},
            "GraphQL": {"demand": 7.5, "why": "Used by major companies as alternative to REST"},
            "Chakra UI": {"demand": 6.5, "why": "Popular React component library for rapid UI development"},
            "Framer Motion": {"demand": 6.8, "why": "Best animation library for React, used in premium UIs"},
            "Vite": {"demand": 8.5, "why": "Replaced Create React App as the go-to build tool"},
        }
    },
    "backend": {
        "label": "Backend Development",
        "skills": {
            "Node.js": {"demand": 9.0, "why": "Most popular backend JS runtime, massive ecosystem"},
            "Express.js": {"demand": 8.2, "why": "Standard Node.js framework, used in most Node backends"},
            "Python": {"demand": 9.5, "why": "Top language for backend, AI/ML, data science, and automation"},
            "FastAPI": {"demand": 8.8, "why": "Fastest growing Python framework, async support and auto docs"},
            "Django": {"demand": 7.8, "why": "Batteries-included Python framework, great for rapid development"},
            "Flask": {"demand": 7.5, "why": "Lightweight Python framework, great for microservices and APIs"},
            "Java": {"demand": 8.0, "why": "Dominant in enterprise, banking, and large-scale systems"},
            "Spring Boot": {"demand": 8.2, "why": "Standard Java framework for enterprise microservices"},
            "Go": {"demand": 8.5, "why": "Rising fast for high-performance services, used by Docker, Kubernetes"},
            "Rust": {"demand": 7.5, "why": "Growing in systems programming and performance-critical services"},
            "C#": {"demand": 7.8, "why": "Essential for .NET ecosystem and enterprise Windows apps"},
            "REST API": {"demand": 9.2, "why": "Standard for web services, every backend developer must know this"},
            "GraphQL": {"demand": 7.5, "why": "API query language used by Facebook, GitHub, Shopify"},
            "Microservices": {"demand": 8.5, "why": "Architecture pattern used by all large tech companies"},
            "gRPC": {"demand": 7.2, "why": "High-performance RPC framework used in distributed systems"},
        }
    },
    "database": {
        "label": "Databases",
        "skills": {
            "PostgreSQL": {"demand": 9.0, "why": "Most loved relational DB, preferred over MySQL in modern stacks"},
            "MySQL": {"demand": 7.8, "why": "Widely used relational DB, standard in many enterprise systems"},
            "MongoDB": {"demand": 8.2, "why": "Leading NoSQL database, great for flexible document storage"},
            "Redis": {"demand": 8.5, "why": "Essential for caching, sessions, and real-time features"},
            "Firebase Firestore": {"demand": 7.5, "why": "Popular for real-time apps and rapid prototyping"},
            "SQL": {"demand": 9.0, "why": "Fundamental skill required in almost every data-related role"},
            "Prisma": {"demand": 8.0, "why": "Modern ORM, replacing Sequelize in Node.js/TypeScript stacks"},
            "Supabase": {"demand": 8.2, "why": "Open-source Firebase alternative, rapidly growing"},
            "Elasticsearch": {"demand": 7.5, "why": "Industry standard for full-text search at scale"},
            "Cassandra": {"demand": 7.0, "why": "Used by Netflix, Uber for high-write distributed workloads"},
        }
    },
    "devops_cloud": {
        "label": "DevOps & Cloud",
        "skills": {
            "Docker": {"demand": 9.2, "why": "Containerization is now a baseline expectation for developers"},
            "Kubernetes": {"demand": 8.8, "why": "Standard for container orchestration at scale"},
            "AWS": {"demand": 9.5, "why": "Largest cloud provider, required for most senior/backend roles"},
            "GCP": {"demand": 8.0, "why": "Google Cloud, strong for AI/ML workloads and data pipelines"},
            "Azure": {"demand": 8.2, "why": "Microsoft cloud, dominant in enterprise environments"},
            "CI/CD": {"demand": 8.8, "why": "Automated pipelines are expected in professional workflows"},
            "GitHub Actions": {"demand": 8.5, "why": "Most popular CI/CD tool, directly integrated with GitHub"},
            "Terraform": {"demand": 8.0, "why": "Infrastructure as code, critical for DevOps roles"},
            "Linux": {"demand": 8.5, "why": "All servers run Linux, non-negotiable for backend/DevOps"},
            "Nginx": {"demand": 7.8, "why": "Standard web server and reverse proxy for production apps"},
            "Git": {"demand": 9.5, "why": "Version control is a baseline skill, non-negotiable"},
        }
    },
    "ai_ml": {
        "label": "AI & Machine Learning",
        "skills": {
            "Machine Learning": {"demand": 9.5, "why": "Highest demand skill in tech right now"},
            "Deep Learning": {"demand": 9.0, "why": "Powers modern AI, required for most ML roles"},
            "TensorFlow": {"demand": 8.5, "why": "Google's ML framework, widely used in production"},
            "PyTorch": {"demand": 9.2, "why": "Preferred ML framework in research and increasingly in industry"},
            "LangChain": {"demand": 9.0, "why": "Standard framework for building LLM applications"},
            "OpenAI API": {"demand": 9.0, "why": "Most used AI API, needed for AI product development"},
            "scikit-learn": {"demand": 8.5, "why": "Standard for classical ML, interviews and real-world use"},
            "NumPy": {"demand": 8.5, "why": "Foundation of Python data science ecosystem"},
            "Pandas": {"demand": 8.8, "why": "Essential for data manipulation and EDA"},
            "Matplotlib": {"demand": 7.5, "why": "Core data visualization library in Python"},
            "Seaborn": {"demand": 7.2, "why": "Statistical visualization, used in data analysis workflows"},
            "NLP": {"demand": 9.0, "why": "Natural Language Processing is central to modern AI products"},
            "Computer Vision": {"demand": 8.5, "why": "High demand in autonomous systems and AI products"},
            "Hugging Face": {"demand": 9.0, "why": "Standard platform for NLP models and LLMs"},
            "RAG": {"demand": 9.2, "why": "Retrieval-Augmented Generation is the top architecture for AI apps"},
        }
    },
    "tools": {
        "label": "Tools & Platforms",
        "skills": {
            "GitHub": {"demand": 9.5, "why": "Standard platform for code collaboration and open source"},
            "Git": {"demand": 9.5, "why": "Version control, non-negotiable for every developer"},
            "Postman": {"demand": 8.0, "why": "Standard tool for API testing and documentation"},
            "VS Code": {"demand": 9.0, "why": "Most popular code editor in the world"},
            "Figma": {"demand": 8.0, "why": "Industry standard for UI/UX design, useful for frontend devs"},
            "Jira": {"demand": 7.5, "why": "Standard project management tool in enterprise environments"},
            "Notion": {"demand": 7.0, "why": "Popular documentation and productivity tool"},
            "Cloudinary": {"demand": 7.0, "why": "Widely used for image/video management in web apps"},
            "Vercel": {"demand": 8.5, "why": "Most popular platform for deploying Next.js/React apps"},
            "Netlify": {"demand": 7.8, "why": "Popular for JAMstack deployments and static sites"},
        }
    },
    "dsa_cs": {
        "label": "CS Fundamentals & DSA",
        "skills": {
            "DSA": {"demand": 9.5, "why": "Core requirement for FAANG and top-tier technical interviews"},
            "System Design": {"demand": 9.5, "why": "Essential for senior roles and top tech company interviews"},
            "OOP": {"demand": 8.5, "why": "Fundamental programming paradigm used across all languages"},
            "Design Patterns": {"demand": 8.0, "why": "Needed for writing maintainable, scalable code"},
            "Computer Networks": {"demand": 7.5, "why": "Required for backend, DevOps, and system design interviews"},
            "Operating Systems": {"demand": 7.5, "why": "Key for systems programming and infrastructure roles"},
            "DBMS": {"demand": 8.0, "why": "Database concepts are tested in most technical interviews"},
            "C": {"demand": 7.0, "why": "Foundational systems language, useful for understanding internals"},
        }
    }
}

# Flat skill lookup for quick matching: skill_name -> {category, demand, why}
FLAT_SKILLS = {}
for cat_key, cat_data in TRENDING_SKILLS.items():
    for skill, meta in cat_data["skills"].items():
        FLAT_SKILLS[skill.lower()] = {
            "name": skill,
            "category": cat_key,
            "category_label": cat_data["label"],
            "demand": meta["demand"],
            "why": meta["why"]
        }