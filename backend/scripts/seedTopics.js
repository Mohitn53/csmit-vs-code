import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import TopicRepository from '../src/repositories/TopicRepository.js';
import Topic from '../src/domain/Topic.js';

dotenv.config();

/**
 * Seed script to populate database with initial topics
 */

const topics = [
  // AI & ML
  { primary_name: 'TensorFlow', category: 'AI & ML', synonyms: ['TF', 'Tensorflow'], job_roles: ['Machine Learning Engineer', 'AI Developer', 'Data Scientist'] },
  { primary_name: 'PyTorch', category: 'AI & ML', synonyms: ['Torch'], job_roles: ['ML Engineer', 'Deep Learning Engineer', 'Research Scientist'] },
  { primary_name: 'OpenAI GPT', category: 'AI & ML', synonyms: ['GPT', 'ChatGPT', 'GPT-4'], job_roles: ['AI Engineer', 'NLP Engineer', 'LLM Developer'] },
  { primary_name: 'LangChain', category: 'AI & ML', synonyms: ['Lang Chain'], job_roles: ['AI Developer', 'LLM Engineer'] },
  { primary_name: 'Hugging Face', category: 'AI & ML', synonyms: ['HF', 'Transformers'], job_roles: ['ML Engineer', 'NLP Engineer'] },
  { primary_name: 'Stable Diffusion', category: 'AI & ML', synonyms: ['SD', 'Image Generation'], job_roles: ['AI Artist', 'ML Engineer'] },
  
  // Cloud & DevOps
  { primary_name: 'Kubernetes', category: 'Cloud & DevOps', synonyms: ['K8s', 'K8', 'Kube'], job_roles: ['DevOps Engineer', 'Cloud Engineer', 'SRE'] },
  { primary_name: 'Docker', category: 'Cloud & DevOps', synonyms: ['Containers'], job_roles: ['DevOps Engineer', 'Software Engineer'] },
  { primary_name: 'AWS', category: 'Cloud & DevOps', synonyms: ['Amazon Web Services'], job_roles: ['Cloud Engineer', 'AWS Architect'] },
  { primary_name: 'Terraform', category: 'Cloud & DevOps', synonyms: ['IaC'], job_roles: ['DevOps Engineer', 'Cloud Engineer'] },
  { primary_name: 'GitHub Actions', category: 'Cloud & DevOps', synonyms: ['GH Actions', 'CI/CD'], job_roles: ['DevOps Engineer', 'Software Engineer'] },
  
  // Web & Frameworks
  { primary_name: 'Next.js', category: 'Web & Frameworks', synonyms: ['Nextjs', 'Next'], job_roles: ['Frontend Developer', 'Full Stack Developer'] },
  { primary_name: 'React', category: 'Web & Frameworks', synonyms: ['ReactJS', 'React.js'], job_roles: ['Frontend Developer', 'React Developer'] },
  { primary_name: 'Vue.js', category: 'Web & Frameworks', synonyms: ['Vue', 'Vuejs'], job_roles: ['Frontend Developer', 'Vue Developer'] },
  { primary_name: 'Svelte', category: 'Web & Frameworks', synonyms: ['SvelteKit'], job_roles: ['Frontend Developer', 'Web Developer'] },
  { primary_name: 'Tailwind CSS', category: 'Web & Frameworks', synonyms: ['Tailwind'], job_roles: ['Frontend Developer', 'UI Developer'] },
  { primary_name: 'TypeScript', category: 'Web & Frameworks', synonyms: ['TS'], job_roles: ['Software Engineer', 'Frontend Developer'] },
  
  // Mobile
  { primary_name: 'React Native', category: 'Mobile', synonyms: ['RN'], job_roles: ['Mobile Developer', 'React Developer'] },
  { primary_name: 'Flutter', category: 'Mobile', synonyms: ['Dart Flutter'], job_roles: ['Mobile Developer', 'Flutter Developer'] },
  { primary_name: 'Swift', category: 'Mobile', synonyms: ['SwiftUI'], job_roles: ['iOS Developer', 'Apple Developer'] },
  { primary_name: 'Kotlin', category: 'Mobile', synonyms: ['Kotlin Android'], job_roles: ['Android Developer', 'Mobile Engineer'] },
  
  // Data & Analytics
  { primary_name: 'Apache Spark', category: 'Data & Analytics', synonyms: ['Spark'], job_roles: ['Data Engineer', 'Big Data Engineer'] },
  { primary_name: 'PostgreSQL', category: 'Data & Analytics', synonyms: ['Postgres', 'PSQL'], job_roles: ['Database Admin', 'Backend Developer'] },
  { primary_name: 'MongoDB', category: 'Data & Analytics', synonyms: ['Mongo'], job_roles: ['Database Admin', 'Backend Developer'] },
  { primary_name: 'dbt', category: 'Data & Analytics', synonyms: ['Data Build Tool'], job_roles: ['Analytics Engineer', 'Data Engineer'] },
  
  // Security
  { primary_name: 'Zero Trust', category: 'Security', synonyms: ['ZT Security'], job_roles: ['Security Engineer', 'Security Architect'] },
  { primary_name: 'OAuth 2.0', category: 'Security', synonyms: ['OAuth', 'OAuth2'], job_roles: ['Security Engineer', 'Backend Developer'] },
  
  // Gaming
  { primary_name: 'Unreal Engine', category: 'Gaming', synonyms: ['UE5', 'UE'], job_roles: ['Game Developer', 'Game Engine Programmer'] },
  { primary_name: 'Unity', category: 'Gaming', synonyms: ['Unity3D'], job_roles: ['Game Developer', 'Unity Developer'] },
  
  // Blockchain
  { primary_name: 'Ethereum', category: 'Blockchain', synonyms: ['ETH'], job_roles: ['Blockchain Developer', 'Smart Contract Developer'] },
  { primary_name: 'Solidity', category: 'Blockchain', synonyms: [], job_roles: ['Smart Contract Developer', 'Blockchain Engineer'] },
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    console.log(`Seeding ${topics.length} topics`);

    const topicModels = topics.map(t => new Topic(t));
    
    const created = await TopicRepository.createBulk(topicModels);
    
    console.log(`✓ Successfully seeded ${created.length} topics`);
    
    // Group by category
    const byCategory = created.reduce((acc, topic) => {
      acc[topic.category] = (acc[topic.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nTopics by category:');
    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
