"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Briefcase, Globe, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { id: "1", name: "Developer & Intelligence Tech", desc: "Core AI models, developer tools, and foundational intelligence infrastructure." },
  { id: "2", name: "Physical AI & Robotics Tech", desc: "Autonomous systems, humanoid robotics, and physical world AI integration." },
  { id: "3", name: "Mobility & SDV Tech", desc: "Software-defined vehicles, EV infrastructure, and next-gen transportation." },
  { id: "4", name: "Edge & Hardware Tech", desc: "AI chips, edge computing, and specialized hardware accelerators." },
  { id: "5", name: "Mobile & Electronics Tech", desc: "Consumer AI devices, wearables, and next-gen mobile platforms." },
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = categories.find(c => c.id === categoryId) || categories[0];
  
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      // Fetch all unique topics from Supabase
      const { data, error } = await supabase
        .from('tech_metrics')
        .select('topic_name, jobs, github, trends, news')
        .limit(2000);

      if (data && !error) {
        // Group by topic to get the latest metrics
        const topicMap = new Map();
        data.forEach(item => {
          // Just keeping the latest/highest values for a simple summary
          if (!topicMap.has(item.topic_name)) {
            topicMap.set(item.topic_name, {
              id: item.topic_name,
              name: item.topic_name,
              score: Math.floor(Math.random() * 40) + 50, // Mock score for now
              trend: Math.random() > 0.3 ? "up" : "down",
              pillars: {
                dev: Math.min(100, Math.max(10, item.github / 10)),
                market: Math.min(100, Math.max(10, item.trends)),
                job: Math.min(100, Math.max(10, item.jobs / 50)),
                media: Math.min(100, Math.max(10, item.news / 5)),
              }
            });
          }
        });

        // Convert map to array and take a slice based on category ID to simulate categorization
        const allTopics = Array.from(topicMap.values());
        const startIndex = (parseInt(categoryId) - 1) * 20;
        const categoryTopics = allTopics.slice(startIndex, startIndex + 20);
        
        setTopics(categoryTopics);
      }
      setLoading(false);
    }

    fetchTopics();
  }, [categoryId]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative glass-card p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-4">
              Layer 0{category.id}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{category.name}</h1>
            <p className="text-muted-foreground max-w-2xl">{category.desc}</p>
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {topics.map((topic, i) => (
            <Link href={`/dashboard/topic/${encodeURIComponent(topic.name)}`} key={topic.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 hover:bg-white/5 transition-all cursor-pointer group h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">{topic.name}</h3>
                  <div className={`flex items-center gap-1 text-sm font-medium ${topic.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {topic.score}
                    {topic.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Dev</span>
                      <span>{Math.round(topic.pillars.dev)}</span>
                    </div>
                    <Progress value={topic.pillars.dev} className="h-1.5" indicatorColor="bg-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Market</span>
                      <span>{Math.round(topic.pillars.market)}</span>
                    </div>
                    <Progress value={topic.pillars.market} className="h-1.5" indicatorColor="bg-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Jobs</span>
                      <span>{Math.round(topic.pillars.job)}</span>
                    </div>
                    <Progress value={topic.pillars.job} className="h-1.5" indicatorColor="bg-amber-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Media</span>
                      <span>{Math.round(topic.pillars.media)}</span>
                    </div>
                    <Progress value={topic.pillars.media} className="h-1.5" indicatorColor="bg-purple-500" />
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated recently
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Live
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}
