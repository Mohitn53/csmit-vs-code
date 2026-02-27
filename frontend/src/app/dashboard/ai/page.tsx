"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, Database, Code, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AIEnginePage() {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | string>(null);

  const handleAnalyze = () => {
    if (!query) return;
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult("Analysis complete.");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            AI Intelligence Engine
          </h1>
          <p className="text-muted-foreground">Query the raw dataset using natural language to uncover hidden correlations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Query Engine</h3>
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Find topics where GitHub activity is growing >20% but Job Demand is still low...'"
                  className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !query}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      Analyzing Data...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Run Analysis
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Sample Queries</h3>
              <div className="space-y-2">
                {[
                  "Compare Physical AI vs Edge Hardware growth over 30 days.",
                  "Identify 'Sleeper' topics (High Dev, Low Market).",
                  "Which topics have the highest media sentiment volatility?"
                ].map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(q)}
                    className="w-full text-left text-sm p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Output Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 h-full min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  Analysis Output
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" /> Connected to TechIntel DB
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {!result && !isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Bot className="w-16 h-16 mb-4" />
                    <p>Awaiting query...</p>
                  </div>
                ) : isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-primary rounded-full"
                          animate={{ y: ["0%", "-100%", "0%"] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">Synthesizing 4 data pillars...</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <h4 className="text-primary font-medium mb-2">Insight Summary</h4>
                      <p className="text-sm leading-relaxed">
                        Based on your query, I found 3 topics matching the criteria of High Developer Adoption (&gt;80) but Low Job Demand (&lt;40). This typically indicates early-stage technologies that are popular in open-source but haven&apos;t yet crossed the chasm into enterprise hiring.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Structured Results</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Neuromorphic Computing", dev: 85, job: 32 },
                          { name: "Quantum Error Correction", dev: 82, job: 28 },
                          { name: "DNA Data Storage", dev: 88, job: 15 }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-blue-400">Dev: {item.dev}</span>
                              <span className="text-amber-400">Job: {item.job}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
