"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  Globe, 
  Bot,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock data
const generateTrendData = () => {
  let base = 60;
  return Array.from({ length: 30 }).map((_, i) => {
    base += Math.random() * 4 - 1.5;
    return {
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.max(0, Math.min(100, base))
    };
  });
};

const trendData = generateTrendData();

export default function TopicDetailPage() {
  const params = useParams();
  const topicId = params.id as string;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                Layer 01
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                Live Data
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Next-Gen LLM Architectures</h1>
            <p className="text-muted-foreground mt-1">Advanced neural network designs beyond standard transformers.</p>
          </div>
          <div className="glass-card p-4 flex items-center gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Growth Score</div>
              <div className="text-3xl font-bold text-success flex items-center gap-2">
                88.4 <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">30d Trend</div>
              <div className="text-xl font-semibold text-success">+14.2%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Graph - Left Side (Takes up 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 h-[400px] flex flex-col">
              <h3 className="text-lg font-semibold mb-6">Growth Trajectory</h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Summary */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">AI Intelligence Summary</h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Analysis indicates a strong breakout in alternative architectures, specifically State Space Models (SSMs) and Mamba variants. Developer adoption has surged 42% in the last 30 days, driven by efficiency gains in long-context processing.
                </p>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-sm font-medium text-white mb-2">Key Signals Detected:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      GitHub stars for top 3 SSM repositories grew by 15k this week.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      Job postings mentioning "Mamba" or "Jamba" increased by 28%.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      Academic paper mentions in ArXiv preprints hit an all-time high.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pillar Breakdown */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-6">Pillar Breakdown</h3>
              <div className="space-y-6">
                {[
                  { name: "Developer Adoption", icon: Activity, score: 92, color: "bg-blue-500", text: "text-blue-400" },
                  { name: "Market Trends", icon: TrendingUp, score: 85, color: "bg-emerald-500", text: "text-emerald-400" },
                  { name: "Job Demand", icon: Briefcase, score: 78, color: "bg-amber-500", text: "text-amber-400" },
                  { name: "Media Sentiment", icon: Globe, score: 88, color: "bg-purple-500", text: "text-purple-400" },
                ].map((pillar) => (
                  <div key={pillar.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <pillar.icon className={`w-4 h-4 ${pillar.text}`} />
                        <span className="text-sm font-medium">{pillar.name}</span>
                      </div>
                      <span className="text-sm font-bold">{pillar.score}</span>
                    </div>
                    <Progress value={pillar.score} className="h-2" indicatorColor={pillar.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Charts */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">GitHub Activity (7d)</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData.slice(-7)}>
                    <Bar dataKey="score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
