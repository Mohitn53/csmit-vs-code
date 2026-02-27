import { useState, ReactNode } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Layers, Cpu, Car, HardDrive, Smartphone,
  Bell, Menu, Bot, LogOut, User, Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import SearchBar from '../components/ui/SearchBar'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Intelligence', href: '/dashboard/ai', icon: Bot },
  { name: 'Developer & Intelligence', href: '/categories/1', icon: Layers },
  { name: 'Physical AI & Robotics', href: '/categories/2', icon: Cpu },
  { name: 'Mobility & SDV', href: '/categories/3', icon: Car },
  { name: 'Edge & Hardware', href: '/categories/4', icon: HardDrive },
  { name: 'Mobile & Electronics', href: '/categories/5', icon: Smartphone },
]

interface DashboardLayoutProps {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex flex-col border-r border-white/10 glass-panel z-40 flex-shrink-0"
            style={{ minWidth: sidebarOpen ? 280 : 0 }}
          >
            <div className="h-16 flex items-center px-6 border-b border-white/10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  TechIntel
                </span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                Menu
              </div>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link key={item.name} to={item.href}>
                    <div className={cn(
                      'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}>
                      {isActive && (
                        <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                      )}
                      <item.icon className={cn('w-5 h-5', isActive ? 'text-indigo-400' : '')} />
                      {item.name}
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="glass-card p-4 rounded-xl bg-indigo-500/5 border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-green-500">System Online</span>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: 2 mins ago</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full border border-white/10 overflow-hidden hover:ring-2 ring-indigo-500/50 transition-all"
              >
                <img src="https://github.com/shadcn.png" alt="avatar" className="w-full h-full object-cover" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-56 z-50 glass-panel rounded-xl border border-white/10 shadow-2xl py-1 overflow-hidden"
                    >
                      <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b border-white/10 mb-1">
                        My Account
                      </div>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
