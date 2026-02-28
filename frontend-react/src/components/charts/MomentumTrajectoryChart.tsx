import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export interface MomentumData {
  date: string
  score: number | null
  expected: number | null
}

interface MomentumTrajectoryChartProps {
  data: MomentumData[]
}

export default function MomentumTrajectoryChart({ data }: MomentumTrajectoryChartProps) {
  // Find the boundary between actual data and forecasted data
  let forecastStartIndex = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].score === null) {
      forecastStartIndex = i;
      break;
    }
  }

  // To make the chart continuous, copy the last actual score into the expected line
  // so the dotted line starts exactly where the solid line ends
  const continuousData = [...data];
  if (forecastStartIndex > 0) {
    const lastActual = continuousData[forecastStartIndex - 1];
    // Start expected from the last actual score
    continuousData[forecastStartIndex - 1] = {
      ...lastActual,
      expected: lastActual.score
    };
  }

  return (
    <div className="glass-card p-6 flex flex-col h-full bg-[#111118]/80">
      <h3 className="text-lg font-semibold mb-6 flex-shrink-0 text-white">Momentum Trajectory (w/ Forecast)</h3>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={continuousData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ fontWeight: 'bold' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '8px' }}
            />
            {/* Draw a vertical line where the forecast begins */}
            {forecastStartIndex !== -1 && (
              <ReferenceLine 
                x={continuousData[forecastStartIndex].date} 
                stroke="#6b7280" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: 'Forecast', fill: '#6b7280', fontSize: 12 }} 
              />
            )}
            <Area type="monotone" dataKey="expected" name="Forecast (Prophet)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorExpected)" connectNulls />
            <Area type="monotone" dataKey="score" name="Actual Score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
