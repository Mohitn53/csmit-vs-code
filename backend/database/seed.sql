-- Tech Intelligence Platform - Sample Topics Seed Data
-- This file contains sample topics across all categories

-- AI & ML Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('TensorFlow', 'AI & ML', '["TF", "Tensorflow"]', '["Machine Learning Engineer", "AI Developer", "Data Scientist"]'),
('PyTorch', 'AI & ML', '["Torch"]', '["ML Engineer", "Deep Learning Engineer", "Research Scientist"]'),
('OpenAI GPT', 'AI & ML', '["GPT", "ChatGPT", "GPT-4"]', '["AI Engineer", "NLP Engineer", "LLM Developer"]'),
('LangChain', 'AI & ML', '["Lang Chain"]', '["AI Developer", "LLM Engineer"]'),
('Hugging Face', 'AI & ML', '["HF", "Transformers"]', '["ML Engineer", "NLP Engineer"]'),
('Stable Diffusion', 'AI & ML', '["SD", "Image Generation"]', '["AI Artist", "ML Engineer"]'),
('LLaMA', 'AI & ML', '["Llama", "Meta AI"]', '["AI Researcher", "ML Engineer"]'),
('Anthropic Claude', 'AI & ML', '["Claude", "Claude AI"]', '["AI Engineer", "Prompt Engineer"]');

-- Cloud & DevOps Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Kubernetes', 'Cloud & DevOps', '["K8s", "K8", "Kube"]', '["DevOps Engineer", "Cloud Engineer", "SRE"]'),
('Docker', 'Cloud & DevOps', '["Containers"]', '["DevOps Engineer", "Software Engineer"]'),
('AWS', 'Cloud & DevOps', '["Amazon Web Services", "Amazon Cloud"]', '["Cloud Engineer", "AWS Architect", "Solutions Architect"]'),
('Terraform', 'Cloud & DevOps', '["IaC", "Infrastructure as Code"]', '["DevOps Engineer", "Cloud Engineer"]'),
('Azure', 'Cloud & DevOps', '["Microsoft Azure"]', '["Azure Engineer", "Cloud Architect"]'),
('GitHub Actions', 'Cloud & DevOps', '["GH Actions", "CI/CD"]', '["DevOps Engineer", "Software Engineer"]'),
('ArgoCD', 'Cloud & DevOps', '["Argo CD", "GitOps"]', '["DevOps Engineer", "Platform Engineer"]'),
('Prometheus', 'Cloud & DevOps', '["Monitoring"]', '["SRE", "DevOps Engineer"]');

-- Edge & Hardware Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Raspberry Pi', 'Edge & Hardware', '["RasPi", "RPi"]', '["IoT Developer", "Embedded Engineer"]'),
('Arduino', 'Edge & Hardware', '[]', '["Embedded Engineer", "IoT Developer", "Hardware Engineer"]'),
('Edge Computing', 'Edge & Hardware', '["Edge AI"]', '["Edge Engineer", "IoT Architect"]'),
('RISC-V', 'Edge & Hardware', '["RISCV", "RISC V"]', '["Hardware Engineer", "Chip Designer"]'),
('ESP32', 'Edge & Hardware', '["ESP-32"]', '["IoT Developer", "Embedded Engineer"]'),
('Nvidia Jetson', 'Edge & Hardware', '["Jetson", "Jetson Nano"]', '["Edge AI Engineer", "Embedded ML Engineer"]');

-- Security Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Zero Trust', 'Security', '["ZT Security"]', '["Security Engineer", "Security Architect"]'),
('OAuth 2.0', 'Security', '["OAuth", "OAuth2"]', '["Security Engineer", "Backend Developer"]'),
('HashiCorp Vault', 'Security', '["Vault"]', '["Security Engineer", "DevOps Engineer"]'),
('SIEM', 'Security', '["Security Information Event Management"]', '["Security Analyst", "SOC Analyst"]'),
('Penetration Testing', 'Security', '["Pen Testing", "PenTest"]', '["Penetration Tester", "Security Researcher"]'),
('CrowdStrike', 'Security', '["Falcon"]', '["Security Analyst", "Incident Responder"]');

-- Mobility Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('5G', 'Mobility', '["5G Network"]', '["Network Engineer", "Telecom Engineer"]'),
('Autonomous Vehicles', 'Mobility', '["Self-Driving Cars", "AV"]', '["Autonomous Systems Engineer", "Robotics Engineer"]'),
('Tesla FSD', 'Mobility', '["Full Self Driving", "Tesla Autopilot"]', '["Autonomous Driving Engineer", "Computer Vision Engineer"]'),
('Waymo', 'Mobility', '[]', '["AV Engineer", "Robotics Engineer"]'),
('ROS', 'Mobility', '["Robot Operating System"]', '["Robotics Engineer", "Software Engineer"]');

-- Mobile Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('React Native', 'Mobile', '["RN"]', '["Mobile Developer", "React Developer"]'),
('Flutter', 'Mobile', '["Dart Flutter"]', '["Mobile Developer", "Flutter Developer"]'),
('Swift', 'Mobile', '["SwiftUI"]', '["iOS Developer", "Apple Developer"]'),
('Kotlin', 'Mobile', '["Kotlin Android"]', '["Android Developer", "Mobile Engineer"]'),
('SwiftUI', 'Mobile', '["Swift UI"]', '["iOS Developer"]'),
('Jetpack Compose', 'Mobile', '["Compose", "Android Compose"]', '["Android Developer"]');

-- Web & Frameworks Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Next.js', 'Web & Frameworks', '["Nextjs", "Next"]', '["Frontend Developer", "Full Stack Developer", "React Developer"]'),
('React', 'Web & Frameworks', '["ReactJS", "React.js"]', '["Frontend Developer", "React Developer"]'),
('Vue.js', 'Web & Frameworks', '["Vue", "Vuejs"]', '["Frontend Developer", "Vue Developer"]'),
('Svelte', 'Web & Frameworks', '["SvelteKit"]', '["Frontend Developer", "Web Developer"]'),
('Tailwind CSS', 'Web & Frameworks', '["Tailwind"]', '["Frontend Developer", "UI Developer"]'),
('TypeScript', 'Web & Frameworks', '["TS"]', '["Software Engineer", "Frontend Developer"]'),
('Node.js', 'Web & Frameworks', '["Node", "Nodejs"]', '["Backend Developer", "Full Stack Developer"]'),
('Astro', 'Web & Frameworks', '["Astro.build"]', '["Frontend Developer", "Web Developer"]'),
('Remix', 'Web & Frameworks', '["Remix Run"]', '["Full Stack Developer", "React Developer"]'),
('SolidJS', 'Web & Frameworks', '["Solid", "Solid.js"]', '["Frontend Developer"]');

-- Data & Analytics Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Apache Spark', 'Data & Analytics', '["Spark"]', '["Data Engineer", "Big Data Engineer"]'),
('PostgreSQL', 'Data & Analytics', '["Postgres", "PSQL"]', '["Database Admin", "Backend Developer"]'),
('MongoDB', 'Data & Analytics', '["Mongo"]', '["Database Admin", "Backend Developer"]'),
('Snowflake', 'Data & Analytics', '[]', '["Data Engineer", "Data Analyst"]'),
('dbt', 'Data & Analytics', '["Data Build Tool"]', '["Analytics Engineer", "Data Engineer"]'),
('Apache Kafka', 'Data & Analytics', '["Kafka"]', '["Data Engineer", "Backend Engineer"]'),
('Databricks', 'Data & Analytics', '[]', '["Data Engineer", "ML Engineer"]'),
('ClickHouse', 'Data & Analytics', '["Click House"]', '["Data Engineer", "Database Engineer"]');

-- Gaming Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Unreal Engine', 'Gaming', '["UE5", "UE", "Unreal"]', '["Game Developer", "Game Engine Programmer"]'),
('Unity', 'Gaming', '["Unity3D"]', '["Game Developer", "Unity Developer"]'),
('Godot', 'Gaming', '["Godot Engine"]', '["Game Developer", "Indie Developer"]'),
('WebGL', 'Gaming', '["Web GL"]', '["Graphics Programmer", "Game Developer"]'),
('Three.js', 'Gaming', '["Threejs"]', '["3D Developer", "Web Developer"]');

-- Blockchain Topics
INSERT INTO topics (primary_name, category, synonyms, job_roles) VALUES
('Ethereum', 'Blockchain', '["ETH"]', '["Blockchain Developer", "Smart Contract Developer"]'),
('Solidity', 'Blockchain', '[]', '["Smart Contract Developer", "Blockchain Engineer"]'),
('Polygon', 'Blockchain', '["MATIC"]', '["Blockchain Developer", "Web3 Developer"]'),
('Solana', 'Blockchain', '["SOL"]', '["Blockchain Developer", "Rust Developer"]'),
('Web3.js', 'Blockchain', '["Web3", "Web 3"]', '["Web3 Developer", "Blockchain Developer"]'),
('IPFS', 'Blockchain', '["InterPlanetary File System"]', '["Decentralized Storage Developer", "Web3 Developer"]');

-- Show count
SELECT category, COUNT(*) as count 
FROM topics 
GROUP BY category 
ORDER BY category;
