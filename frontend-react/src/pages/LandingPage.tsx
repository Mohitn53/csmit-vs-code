import { Link } from 'react-router-dom'
import { ArrowRight, Activity, TrendingUp, Briefcase, Globe, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
  const { session } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 glass-panel">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            TechIntel
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#pillars" className="hover:text-white transition-colors">Pillars</a>
            <a href="#categories" className="hover:text-white transition-colors">Intelligence Layers</a>
          </nav>
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex items-center justify-center min-h-screen pt-16 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-radial from-indigo-500/20 via-background to-background"></div>
          <div
            className="absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.2), transparent 70%)' }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Real-time Intelligence Engine Active
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Forecast the <span className="text-gradient">Future</span> of Technology
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Predictive analytics powered by developer adoption, market trends, job demand, and real-time media signals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full px-8 h-14 text-base bg-background/80 backdrop-blur-sm border border-indigo-500/50 hover:bg-indigo-500 hover:text-white transition-all duration-300"
              >
                Explore Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#categories"
                className="flex items-center gap-2 rounded-full px-8 h-14 text-base bg-background/50 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                View Intelligence Layers
              </a>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section id="pillars" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">4 Core Data Pillars</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our proprietary forecasting engine synthesizes millions of data points across four critical dimensions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Developer Adoption', icon: Activity, desc: 'GitHub activity, PRs, and ecosystem growth.', color: 'text-blue-400', score: 92 },
                { title: 'Market Trends', icon: TrendingUp, desc: 'Search volume and consumer interest velocity.', color: 'text-emerald-400', score: 88 },
                { title: 'Job Demand', icon: Briefcase, desc: 'Hiring velocity and salary premium trends.', color: 'text-amber-400', score: 95 },
                { title: 'Real-Time Media', icon: Globe, desc: 'News sentiment and social media velocity.', color: 'text-purple-400', score: 84 },
              ].map((pillar, i) => (
                <div key={i} className="glass-card p-6 group hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />
                  <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 ${pillar.color}`}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{pillar.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Signal Strength</span>
                    <span className={`text-lg font-bold ${pillar.color}`}>{pillar.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-24 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligence Layers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Deep dive into specific technology sectors and uncover hidden opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Developer & Intelligence', count: '24 Topics', href: '/categories/1' },
                { name: 'Physical AI & Robotics', count: '18 Topics', href: '/categories/2' },
                { name: 'Mobility & SDV', count: '12 Topics', href: '/categories/3' },
                { name: 'Edge & Hardware', count: '15 Topics', href: '/categories/4' },
                { name: 'Mobile & Electronics', count: '20 Topics', href: '/categories/5' },
              ].map((cat, i) => (
                <Link key={i} to={cat.href}>
                  <div className="glass-card p-6 group hover:bg-white/5 transition-all duration-300 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1 group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.count}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black/40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            TechIntel
          </span>
          <p className="text-sm text-muted-foreground">© 2026 TechIntel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
