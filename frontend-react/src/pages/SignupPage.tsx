import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Github, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email for the confirmation link.')
      }
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : ''
      const msg = err instanceof Error ? err.message : String(err)
      if (name === 'AbortError' || msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('timed out')) {
        setError('Cannot reach the authentication server. Check your internet connection or try a VPN.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg.includes('fetch') ? 'Cannot reach the authentication server. Check your connection.' : msg)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black/40 border-r border-white/10 items-center justify-center p-12">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.2), transparent 70%)' }}
        />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">

            <span className="font-bold text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              TechIntel
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Join the world's most advanced technology forecasting engine.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create an account to access predictive analytics and stay ahead of the technology curve.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-indigo-400 mb-1">100+</div>
              <div className="text-sm text-muted-foreground">Technologies Tracked</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">4</div>
              <div className="text-sm text-muted-foreground">Data Pillars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-muted-foreground">Enter your details to get started.</p>
          </div>

          <button
            onClick={handleGithubLogin}
            className="w-full h-12 glass border border-white/10 rounded-xl flex items-center justify-center gap-3 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            <Github className="w-5 h-5" />
            Sign up with GitHub
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white rounded-xl text-base font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
              >
                {loading ? 'Creating account...' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
