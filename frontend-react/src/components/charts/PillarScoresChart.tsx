import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export interface PillarData {
  name: string
  score: number
  color: string
}

interface PillarScoresChartProps {
  data: PillarData[]
}

export default function PillarScoresChart({ data }: PillarScoresChartProps) {
  return (
    <div className="glass-card p-6 flex flex-col h-full bg-[#111118]/80">
      <h3 className="text-lg font-semibold mb-6 flex-shrink-0 text-white">Pillar Scores</h3>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={true} horizontal={true} />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 13 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip
                cursor={{ fill: '#2a2a35', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
