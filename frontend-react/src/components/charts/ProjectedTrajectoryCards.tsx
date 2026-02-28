export interface ProjectedData {
  sevenDay: number | string
  thirtyDay: number | string
  confidence: number | string
  risk: string
  riskColor?: string
}

interface ProjectedTrajectoryCardsProps {
  data: ProjectedData
}

export default function ProjectedTrajectoryCards({ data }: ProjectedTrajectoryCardsProps) {
  const riskColor = data.riskColor || (data.risk === 'STABLE' ? 'emerald' : data.risk === 'HIGH' ? 'red' : 'amber')
  
  return (
    <div className="glass-card p-6 flex flex-col h-full bg-[#111118]/80">
      <h3 className="text-lg font-semibold mb-6 flex-shrink-0 text-white">Projected Trajectory</h3>
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-white/5">
          <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 uppercase">7-Day</span>
          <span className="text-4xl font-bold text-[#f59e0b]">{data.sevenDay}</span>
        </div>
        <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-white/5">
          <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 uppercase">30-Day</span>
          <span className="text-4xl font-bold text-[#f59e0b]">{data.thirtyDay}</span>
        </div>
        <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-white/5">
          <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 uppercase">Confidence</span>
          <span className="text-3xl font-bold text-white">{data.confidence}%</span>
        </div>
        <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-white/5">
          <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-2 uppercase">Risk</span>
          <span className={`px-3 py-1 bg-${riskColor}-500/10 border border-${riskColor}-500/20 text-${riskColor}-400 rounded-full text-sm font-semibold mt-1`}>{data.risk}</span>
        </div>
      </div>
    </div>
  )
}
