import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { Plus, X, Search, GitCompare, TrendingUp, Loader2, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── Colour palette (up to 4 techs) ──────────────────────────────────────────
const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
const PALETTE_BG = [
  'rgba(59,130,246,0.12)', 'rgba(16,185,129,0.12)',
  'rgba(245,158,11,0.12)',  'rgba(236,72,153,0.12)',
]
const BADGE_BORDER = ['border-blue-500/40', 'border-emerald-500/40', 'border-amber-500/40', 'border-pink-500/40']
const BADGE_TEXT   = ['text-blue-400',       'text-emerald-400',       'text-amber-400',       'text-pink-400']
const BADGE_DOT    = ['bg-blue-400',          'bg-emerald-400',          'bg-amber-400',          'bg-pink-400']

// ── Types ────────────────────────────────────────────────────────────────────
interface MetricRow {
  topic_name: string
  iso_week: string
  jobs: number
  github: number
  trends: number
  news: number
}

interface TechSummary {
  name: string
  colorIdx: number
  score: number
  jobs: number
  github: number
  trends: number
  news: number
  history: { week: string; score: number }[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function isoWeekLabel(iso: string) {
  const w = parseInt(iso.substring(6))
  const y = iso.substring(2, 4)
  return `W${w}'${y}`
}

function buildSummary(name: string, colorIdx: number, rows: MetricRow[]): TechSummary {
  const sorted = [...rows].sort((a, b) => a.iso_week.localeCompare(b.iso_week)).slice(-12)

  const maxJobs   = Math.max(...sorted.map(r => r.jobs   || 1))
  const maxGithub = Math.max(...sorted.map(r => r.github || 1))
  const maxTrends = Math.max(...sorted.map(r => r.trends || 1))
  const maxNews   = Math.max(...sorted.map(r => r.news   || 1))

  const history = sorted.map(r => ({
    week: isoWeekLabel(r.iso_week),
    score: Math.round(
      (((r.jobs   || 0) / maxJobs)   * 100 +
       ((r.github || 0) / maxGithub) * 100 +
       ((r.trends || 0) / maxTrends) * 100 +
       ((r.news   || 0) / maxNews)   * 100) / 4
    ),
  }))

  const latest = sorted[sorted.length - 1]
  return {
    name,
    colorIdx,
    score: history[history.length - 1]?.score ?? 0,
    jobs:    Math.round(((latest?.jobs   || 0) / maxJobs)   * 100),
    github:  Math.round(((latest?.github || 0) / maxGithub) * 100),
    trends:  Math.round(((latest?.trends || 0) / maxTrends) * 100),
    news:    Math.round(((latest?.news   || 0) / maxNews)   * 100),
    history,
  }
}

// ── Merged chart data builders ───────────────────────────────────────────────
function buildMomentumData(techs: TechSummary[]) {
  const allWeeks = Array.from(
    new Set(techs.flatMap(t => t.history.map(h => h.week)))
  ).sort()
  return allWeeks.map(week => {
    const row: Record<string, string | number> = { week }
    techs.forEach(t => {
      const point = t.history.find(h => h.week === week)
      row[t.name] = point?.score ?? 0
    })
    return row
  })
}

function buildSignalData(techs: TechSummary[]) {
  return ['Jobs', 'GitHub', 'Trends', 'News'].map(signal => {
    const row: Record<string, string | number> = { signal }
    techs.forEach(t => {
      row[t.name] =
        signal === 'Jobs'   ? t.jobs   :
        signal === 'GitHub' ? t.github :
        signal === 'Trends' ? t.trends : t.news
    })
    return row
  })
}

function buildRadarData(techs: TechSummary[]) {
  return ['Jobs', 'GitHub', 'Trends', 'News', 'Overall'].map(axis => {
    const row: Record<string, string | number> = { axis }
    techs.forEach(t => {
      row[t.name] =
        axis === 'Jobs'    ? t.jobs   :
        axis === 'GitHub'  ? t.github :
        axis === 'Trends'  ? t.trends :
        axis === 'News'    ? t.news   : t.score
    })
    return row
  })
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-xl text-sm">
      <p className="text-white/60 mb-2 text-xs font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-white/70 flex-1">{p.name}</span>
          <span className="font-bold text-white ml-4">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [allTopics, setAllTopics]     = useState<string[]>([])
  const [selected, setSelected]       = useState<string[]>([])
  const [summaries, setSummaries]     = useState<TechSummary[]>([])
  const [loading, setLoading]         = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [search, setSearch]           = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load all topic names once
  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('tech_metrics')
        .select('topic_name')
        .limit(5000)
      if (data) {
        const unique = Array.from(new Set(data.map(r => r.topic_name))).sort()
        setAllTopics(unique)
      }
      setTopicsLoading(false)
    }
    fetch()
  }, [])

  // Re-fetch whenever selected changes
  const fetchComparisons = useCallback(async () => {
    if (selected.length === 0) { setSummaries([]); return }
    setLoading(true)
    const { data } = await supabase
      .from('tech_metrics')
      .select('topic_name, iso_week, jobs, github, trends, news')
      .in('topic_name', selected)
    if (data) {
      const built = selected.map((name, i) => {
        const rows = data.filter(r => r.topic_name === name)
        return buildSummary(name, i, rows)
      })
      setSummaries(built)
    }
    setLoading(false)
  }, [selected])

  useEffect(() => { fetchComparisons() }, [fetchComparisons])

  const addTech = (name: string) => {
    if (selected.includes(name) || selected.length >= 4) return
    setSelected(prev => [...prev, name])
    setSearch('')
    setDropdownOpen(false)
  }

  const removeTech = (name: string) => setSelected(prev => prev.filter(n => n !== name))

  const filtered = allTopics.filter(
    t => t.toLowerCase().includes(search.toLowerCase()) && !selected.includes(t)
  )

  const momentumData = buildMomentumData(summaries)
  const signalData   = buildSignalData(summaries)
  const radarData    = buildRadarData(summaries)

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Technology Comparison</h1>
        </div>
        <p className="text-muted-foreground">Compare up to 4 technologies side-by-side across all signal dimensions.</p>
      </div>

      {/* ── Tech Selector ─────────────────────────────────────────────────── */}
      <div className="glass-card p-6 bg-[#111118]/80 overflow-visible relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white mb-0.5">Select Technologies</h2>
            <p className="text-xs text-muted-foreground">Choose 2 – 4 technologies to compare</p>
          </div>
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-white/10 bg-white/5">
            {selected.length} / 4 selected
          </span>
        </div>

        {/* Selected chips */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          <AnimatePresence>
            {selected.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${BADGE_BORDER[i]} ${BADGE_TEXT[i]}`}
                style={{ background: PALETTE_BG[i] }}
              >
                <span className={`w-2 h-2 rounded-full ${BADGE_DOT[i]}`} />
                {name}
                <button
                  onClick={() => removeTech(name)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {selected.length === 0 && (
            <span className="text-sm text-muted-foreground self-center">No technologies selected yet…</span>
          )}
        </div>

        {/* Add dropdown */}
        {selected.length < 4 && (
          <div className="relative" ref={selectorRef}>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 cursor-text"
              onClick={() => setDropdownOpen(true)}
            >
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setDropdownOpen(true) }}
                onFocus={() => setDropdownOpen(true)}
                placeholder={topicsLoading ? 'Loading topics…' : 'Search and add a technology…'}
                disabled={topicsLoading}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-muted-foreground"
              />
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <AnimatePresence>
              {dropdownOpen && filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#18181f] shadow-2xl z-[200]"
                  style={{ backdropFilter: 'none' }}
                >
                  {filtered.slice(0, 40).map(name => (
                    <button
                      key={name}
                      onClick={() => addTech(name)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Loading spinner ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Fetching comparison data…</span>
        </div>
      )}

      {/* ── Need more techs prompt ─────────────────────────────────────────── */}
      {!loading && selected.length === 1 && (
        <div className="glass-card p-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2">
            <GitCompare className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Add one more technology</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Select at least 2 technologies to unlock the comparison visualisations.
          </p>
        </div>
      )}

      {/* ── Charts (visible when ≥2 techs are loaded) ─────────────────────── */}
      {!loading && summaries.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >

          {/* ── Score Cards ─────────────────────────────────────────────────── */}
          <div className={`grid gap-4 ${summaries.length === 2 ? 'grid-cols-2' : summaries.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {summaries.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5 relative overflow-hidden group"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{ background: `radial-gradient(circle at top right, ${PALETTE[i]}18, transparent 60%)` }}
                />
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PALETTE[i] }} />
                  <span className="text-xs font-medium text-muted-foreground truncate">{t.name}</span>
                </div>
                <div className="text-4xl font-black mb-1" style={{ color: PALETTE[i] }}>{t.score}</div>
                <div className="text-xs text-muted-foreground mb-3">Overall Score</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Jobs','GitHub','Trends','News'] as const).map((label, li) => {
                    const val = li === 0 ? t.jobs : li === 1 ? t.github : li === 2 ? t.trends : t.news
                    return (
                      <div key={label} className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${val}%`, background: PALETTE[i] }} />
                        </div>
                        <span className="text-muted-foreground w-10 text-right">{label}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Momentum Race (Line) ─────────────────────────────────────────── */}
          <div className="glass-card p-6 bg-[#111118]/80">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-base font-semibold text-white">Momentum Race — Score Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={momentumData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis dataKey="week" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#9ca3af' }}
                  iconType="circle"
                  iconSize={8}
                />
                {summaries.map((t, i) => (
                  <Line
                    key={t.name}
                    type="monotone"
                    dataKey={t.name}
                    stroke={PALETTE[i]}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: PALETTE[i], strokeWidth: 0 }}
                    activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Signal Pillars (Grouped Bar) + Radar ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Grouped bar */}
            <div className="glass-card p-6 bg-[#111118]/80">
              <h3 className="text-base font-semibold text-white mb-6">Signal Pillars Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={signalData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                  <XAxis dataKey="signal" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#9ca3af' }} iconType="circle" iconSize={8} />
                  {summaries.map((t, i) => (
                    <Bar key={t.name} dataKey={t.name} fill={PALETTE[i]} radius={[3, 3, 0, 0]} maxBarSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar */}
            <div className="glass-card p-6 bg-[#111118]/80">
              <h3 className="text-base font-semibold text-white mb-6">Multi-Dimensional Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#2a2a35" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} />
                  {summaries.map((t, i) => (
                    <Radar
                      key={t.name}
                      name={t.name}
                      dataKey={t.name}
                      stroke={PALETTE[i]}
                      fill={PALETTE[i]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#9ca3af' }} iconType="circle" iconSize={8} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Summary Table ────────────────────────────────────────────────── */}
          <div className="glass-card p-6 bg-[#111118]/80 overflow-x-auto">
            <h3 className="text-base font-semibold text-white mb-5">Detailed Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">Metric</th>
                  {summaries.map((t, i) => (
                    <th key={t.name} className="text-left py-3 px-4 font-semibold" style={{ color: PALETTE[i] }}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PALETTE[i] }} />
                        {t.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(['Overall Score', 'Jobs Signal', 'GitHub Signal', 'Trends Signal', 'News Signal'] as const).map((metric) => {
                  const vals = summaries.map(t =>
                    metric === 'Overall Score' ? t.score :
                    metric === 'Jobs Signal'   ? t.jobs  :
                    metric === 'GitHub Signal' ? t.github :
                    metric === 'Trends Signal' ? t.trends : t.news
                  )
                  const max = Math.max(...vals)
                  return (
                    <tr key={metric} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-muted-foreground font-medium">{metric}</td>
                      {vals.map((v, vi) => (
                        <td key={vi} className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden max-w-[80px]">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${v}%`, background: PALETTE[vi], opacity: v === max ? 1 : 0.5 }}
                              />
                            </div>
                            <span className={`font-bold tabular-nums ${v === max ? 'text-white' : 'text-muted-foreground'}`}>
                              {v}
                              {v === max && (
                                <span className="ml-1 text-[10px] font-normal text-muted-foreground">▲</span>
                              )}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────────── */}
      {!loading && selected.length === 0 && (
        <div className="glass-card p-14 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <GitCompare className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Start Comparing</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Search and select 2 to 4 technologies above to generate a full side-by-side comparison across
            momentum scores, signal pillars, and multi-dimensional radar analysis.
          </p>
        </div>
      )}
    </div>
  )
}
