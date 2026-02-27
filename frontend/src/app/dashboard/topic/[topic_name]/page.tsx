"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Brush
} from "recharts";
import { motion } from "framer-motion";

export default function TopicPage() {
  const params = useParams();
  const topicName = decodeURIComponent(params.topic_name as string);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTopicData() {
      setLoading(true);
      const { data: metrics, error } = await supabase
        .from('tech_metrics')
        .select('*')
        .eq('topic_name', topicName)
        .order('iso_week', { ascending: true });

      if (error) {
        console.error("Error fetching topic data:", error);
      } else if (metrics) {
        // Format data for chart
        const formattedData = metrics.map(m => {
          const year = m.iso_week.substring(0, 4);
          const weekNum = parseInt(m.iso_week.substring(6));
          return {
            ...m,
            date: `W${weekNum} '${year.substring(2)}`,
          };
        });
        setData(formattedData);
      }
      setLoading(false);
    }

    if (topicName) {
      fetchTopicData();
    }
  }, [topicName]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{topicName}</h1>
        <p className="text-muted-foreground">Detailed metrics and forecasting for this topic.</p>
      </div>

      <div className="glass-card p-6 h-[500px] flex flex-col">
        <h3 className="text-lg font-semibold mb-6">Metrics Over Time</h3>
        
        <div className="flex-1 w-full relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="jobs" name="Jobs" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="github" name="GitHub" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="trends" name="Trends" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="news" name="News" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="rgba(255,255,255,0.2)" 
                  fill="rgba(0,0,0,0.2)"
                  tickFormatter={() => ''}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No data available for this topic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
