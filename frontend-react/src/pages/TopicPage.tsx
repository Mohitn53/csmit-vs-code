import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import MomentumTrajectoryChart, { MomentumData } from '../components/charts/MomentumTrajectoryChart'
import PillarScoresChart, { PillarData } from '../components/charts/PillarScoresChart'
import SignalProfileChart, { SignalData } from '../components/charts/SignalProfileChart'
import ProjectedTrajectoryCards, { ProjectedData } from '../components/charts/ProjectedTrajectoryCards'

// Simple helper to convert iso_week (e.g. "2024-W01") to a YYYY-MM-DD date.
function getDateFromIsoWeek(isoWeek: string) {
  const year = parseInt(isoWeek.substring(0, 4));
  const week = parseInt(isoWeek.substring(6));
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const ISOweekStart = simple;
  if (dayOfWeek <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart.toISOString().split('T')[0];
}

export default function TopicPage() {
  const { topic_name } = useParams<{ topic_name: string }>()
  const topicName = decodeURIComponent(topic_name || '')
  
  const [loading, setLoading] = useState(true)
  const [momentumData, setMomentumData] = useState<MomentumData[]>([])
  const [pillarData, setPillarData] = useState<PillarData[]>([])
  const [signalData, setSignalData] = useState<SignalData[]>([])
  const [projectedData, setProjectedData] = useState<ProjectedData>({
    sevenDay: 0,
    thirtyDay: 0,
    confidence: 0,
    risk: 'STABLE'
  })

  useEffect(() => {
    async function fetchTopicData() {
      if (!topicName) return
      setLoading(true)
      const { data: metrics, error } = await supabase
        .from('tech_metrics')
        .select('*')
        .eq('topic_name', topicName)
        .order('iso_week', { ascending: true })

      if (error) {
        console.error('Error fetching topic data:', error)
        setLoading(false)
        return
      } 
      
      if (metrics && metrics.length > 0) {
        // Take the first 12 weeks to respect "12th week" baseline for Prophet forecast
        const historicalMetrics = metrics.slice(0, 12)

        const maxJobs = Math.max(...historicalMetrics.map(m => m.jobs || 1))
        const maxGithub = Math.max(...historicalMetrics.map(m => m.github || 1))
        const maxTrends = Math.max(...historicalMetrics.map(m => m.trends || 1))
        const maxNews = Math.max(...historicalMetrics.map(m => m.news || 1))

        let formatted = historicalMetrics.map((m, idx) => {
          const year = m.iso_week.substring(0, 4)
          const weekNum = parseInt(m.iso_week.substring(6))
          const dateStr = `W${weekNum} '${year.substring(2)}`
          
          const nJobs = ((m.jobs || 0) / maxJobs) * 100
          const nGithub = ((m.github || 0) / maxGithub) * 100
          const nTrends = ((m.trends || 0) / maxTrends) * 100
          const nNews = ((m.news || 0) / maxNews) * 100
          const score = (nJobs + nGithub + nTrends + nNews) / 4

          return {
            date: dateStr,
            isoDateForProphet: getDateFromIsoWeek(m.iso_week),
            score: Math.round(score),
            expected: null,
            nJobs, nGithub, nTrends, nNews
          }
        })

        // Call Prophet Forecasting model
        try {
          const prophetHistory = formatted.map(f => ({
            date: f.isoDateForProphet,
            value: f.score
          }));
          
          const response = await fetch('http://localhost:5002/forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: prophetHistory, periods: 4 })
          });

          if (response.ok) {
            const result = await response.json();
            const forecasts = result.forecast;
            
            // Generate standard week labels for the forecast dates
            const lastDate = new Date(formatted[formatted.length - 1].isoDateForProphet);
            const futureFormatted = forecasts.map((fItem: any, i: number) => {
              const fDate = new Date(fItem.date);
              // get week based on simple offset
              const diffTime = Math.abs(fDate.getTime() - lastDate.getTime());
              const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
              
              const lastWeekStr = formatted[formatted.length - 1].date; // e.g. W23 '23
              const lastWeekNum = parseInt(lastWeekStr.split(' ')[0].substring(1));
              const projectedWeekNum = lastWeekNum + i + 1;
              const dateStr = `W${projectedWeekNum} (Pred)`;
              
              return {
                date: dateStr,
                score: null, // "Actual" score is null
                expected: Math.round(fItem.value), // Prophet forecast mapped to "expected" line
                nJobs: 0, nGithub: 0, nTrends: 0, nNews: 0
              }
            });

            formatted = [...formatted, ...futureFormatted];
          }
        } catch (err) {
          console.error("Prophet forecast error:", err);
          // Fallback if Prophet service is down
        }

        const validHistory = formatted.filter(f => f.score !== null);
        
        setMomentumData(formatted.map(f => ({ date: f.date, score: f.score, expected: f.expected })))
        
        const latestActual = validHistory[validHistory.length - 1] || formatted[formatted.length - 1];

        setPillarData([
          { name: 'Developer', score: Math.round(latestActual.nGithub || 0), color: '#3b82f6' },
          { name: 'Market', score: Math.round(((latestActual.nTrends || 0) + (latestActual.nNews || 0)) / 2), color: '#10b981' },
          { name: 'Business', score: Math.round(latestActual.nJobs || 0), color: '#f59e0b' },
          { name: 'Overall', score: Math.round(latestActual.score || latestActual.expected || 0), color: '#8b5cf6' }
        ])

        setSignalData([
          { subject: 'Jobs', A: Math.round(latestActual.nJobs), fullMark: 100 },
          { subject: 'GitHub', A: Math.round(latestActual.nGithub), fullMark: 100 },
          { subject: 'Trends', A: Math.round(latestActual.nTrends), fullMark: 100 },
          { subject: 'News', A: Math.round(latestActual.nNews), fullMark: 100 },
        ])

        const predLast = formatted[formatted.length - 1].expected || formatted[formatted.length - 1].score || 0;
        const predBefore = validHistory.length > 0 ? (validHistory[validHistory.length - 1].score || 0) : predLast;
        const trendDiff = predLast - predBefore;
        
        let risk = 'STABLE'
        if (trendDiff < -5) risk = 'HIGH'
        if (trendDiff > 5) risk = 'LOW'
        
        setProjectedData({
          sevenDay: Math.round(predBefore + (trendDiff * 0.25)),
          thirtyDay: Math.round(predLast),
          confidence: 85,
          risk: risk
        })
      }
      setLoading(false)
    }
    fetchTopicData()
  }, [topicName])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{topicName}</h1>
        <p className="text-muted-foreground">Detailed metrics and 4-Week Prophet forecasting.</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center bg-[#111118]/80 rounded-xl border border-white/5">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : momentumData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MomentumTrajectoryChart data={momentumData} />
            </div>
            <div className="lg:col-span-1">
              <ProjectedTrajectoryCards data={projectedData} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
            <div>
              <PillarScoresChart data={pillarData} />
            </div>
            <div>
              <SignalProfileChart data={signalData} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-64 items-center justify-center text-muted-foreground bg-[#111118]/80 rounded-xl border border-white/5">
          No data available for this topic.
        </div>
      )}
    </div>
  )
}
