import { Bot, Zap, BrainCircuit, Sparkles } from 'lucide-react'

export default function AIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Intelligence</h1>
        <p className="text-muted-foreground">AI-powered insights and forecasting summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Zap, title: 'Trend Acceleration', value: '↑ 23%', desc: 'Physical AI sector growth rate this quarter', color: 'text-amber-400' },
          { icon: BrainCircuit, title: 'AI Confidence Score', value: '94.2', desc: 'Model confidence in current forecasts', color: 'text-indigo-400' },
          { icon: Sparkles, title: 'Emerging Signals', value: '7 New', desc: 'Newly detected technology trend signals', color: 'text-emerald-400' },
        ].map((card, i) => (
          <div key={i} className="glass-card p-6 relative overflow-hidden">
            <div className={`w-10 h-10 rounded-lg glass flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-sm font-medium mb-1">{card.title}</div>
            <div className="text-xs text-muted-foreground">{card.desc}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold">TechIntel AI Analyst</h3>
            <p className="text-xs text-muted-foreground">Powered by real-time data synthesis</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            'Physical AI & Robotics continues to dominate growth signals with a 92.1 composite score, driven by a 340% YoY increase in GitHub repository activity.',
            'Edge & Hardware sector is showing accelerating adoption with a strong correlation between chip demand and enterprise AI deployment rates.',
            'Developer tooling categories are experiencing consolidation, with 3 major platforms capturing 78% of developer mindshare.',
            'Job demand signals indicate a 45% premium for LLM fine-tuning expertise, suggesting a significant supply-demand gap in the market.',
          ].map((insight, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-indigo-400 font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
