import { useState } from 'react'
import { User, Mail, Shield, LogOut, Edit2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { session } = useAuth()
  const user = session?.user
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.auth.updateUser({ data: { full_name: displayName } })
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Avatar + Name */}
      <div className="glass-card p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="flex gap-3 items-center">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <button
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-muted-foreground mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Account Details</h3>

        {[
          { icon: User, label: 'Display Name', value: displayName },
          { icon: Mail, label: 'Email Address', value: user?.email || '—' },
          { icon: Shield, label: 'Account Status', value: user?.confirmed_at ? 'Verified' : 'Unverified' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
            <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-sm font-medium mt-0.5">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Session</h3>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
