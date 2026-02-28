import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

export interface SignalData {
  subject: string
  A: number
  fullMark: number
}

interface SignalProfileChartProps {
  data: SignalData[]
}

export default function SignalProfileChart({ data }: SignalProfileChartProps) {
  return (
    <div className="glass-card p-6 flex flex-col h-full bg-[#111118]/80">
      <h3 className="text-lg font-semibold mb-2 flex-shrink-0 text-white">Signal Profile</h3>
      <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#2a2a35" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 13 }} />
            <PolarRadiusAxis domain={[0, 120]} tick={{ fill: '#6b7280', fontSize: 10 }} orientation="middle" axisLine={false} />
            <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#f59e0b' }}
            />
            <Radar name="Signal" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
