import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, TrendingUp, Zap, Clock } from 'lucide-react'
import ForecastChart from '../components/charts/ForecastChart'
import MomentumTrajectoryChart from '../components/charts/MomentumTrajectoryChart'
import PillarScoresChart from '../components/charts/PillarScoresChart'
import SignalProfileChart from '../components/charts/SignalProfileChart'
import ProjectedTrajectoryCards from '../components/charts/ProjectedTrajectoryCards'
import { supabase } from '../lib/supabase'

export default function DashboardHome() {
  const [totalTopics, setTotalTopics] = useState('100')

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('tech_metrics')
        .select('topic_name')
        .limit(2000)
      if (data && !error) {
        const unique = new Set(data.map((item) => item.topic_name))
        setTotalTopics(unique.size.toString())
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { name: 'Total Topics Tracked', value: totalTopics, icon: Layers, trend: 'Active', color: 'text-blue-400' },
    { name: 'Average Growth Score', value: '76.4', icon: TrendingUp, trend: '+4.2% vs last week', color: 'text-emerald-400' },
    { name: 'Fastest Growing', value: 'Physical AI', icon: Zap, trend: '92.1 Score', color: 'text-amber-400' },
    { name: 'Next Update In', value: '14h 22m', icon: Clock, trend: 'Real-time sync', color: 'text-purple-400' },
  ]

  const mockMomentumData = [
    { date: 'Day 1', score: 72, expected: 70 },
    { date: 'Day 2', score: 75, expected: 73 },
    { date: 'Day 3', score: 78, expected: 75 },
    { date: 'Day 4', score: 81, expected: 76 },
    { date: 'Day 5', score: 82, expected: 78 },
    { date: 'Day 6', score: 84, expected: 80 },
    { date: 'Day 7', score: 87, expected: 82 },
    { date: 'Day 8', score: 89, expected: 84 },
    { date: 'Day 9', score: null, expected: 88 },
    { date: 'Day 10', score: null, expected: 92 },
    { date: 'Day 11', score: null, expected: 95 },
    { date: 'Day 12', score: null, expected: 98 },
  ]

  const mockPillarData = [
    { name: 'W32', Developer: 45, Market: 60, Business: 85 },
    { name: 'W33', Developer: 55, Market: 65, Business: 82 },
    { name: 'W34', Developer: 75, Market: 70, Business: 80 },
    { name: 'W35', Developer: 85, Market: 80, Business: 75 },
    { name: 'W36', Developer: 95, Market: 85, Business: 70 },
    { name: 'W37', Developer: 100, Market: 90, Business: 65 },
  ]

  const mockSignalData = [
    { subject: 'Developer', A: 85, fullMark: 100 },
    { subject: 'Market', A: 75, fullMark: 100 },
    { subject: 'Business', A: 65, fullMark: 100 },
    { subject: 'Community', A: 90, fullMark: 100 },
    { subject: 'Growth', A: 80, fullMark: 100 },
  ]

  const mockProjectedData = {
    sevenDay: 100.0,
    thirtyDay: 100.0,
    confidence: 85,
    risk: 'STABLE',
    riskColor: 'emerald'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">Real-time intelligence across 5 technology layers.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg glass flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.name}</h3>
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trajectory and Pillar Scores Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MomentumTrajectoryChart data={mockMomentumData} />
        </div>
        <div>
          <PillarScoresChart data={mockPillarData} />
        </div>
      </div>

      {/* Signal Profile and Projected Trajectory Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SignalProfileChart data={mockSignalData} />
        </div>
        <div>
          <ProjectedTrajectoryCards data={mockProjectedData} />
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-auto min-h-[500px]">
        <ForecastChart />
      </div>
    </div>
  )
}
